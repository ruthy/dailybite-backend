require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { sendWelcomeEmail } = require("./emailService");

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      "https://dailybite.fit", "https://www.dailybite.fit",
      "https://dailybite-backend-pw2i.onrender.com",
      "capacitor://localhost", "http://localhost:3000", "http://localhost:5173", "http://localhost:4173",
    ];
    if (!origin || allowed.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, message: { error: "Too many requests." } }));

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Authentication required" });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Invalid or expired token" });
  req.user = user;
  next();
}

// OpenAI (lazy load to avoid crash if not installed)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) { /* openai package not available */ }
}

// Rate limiters for specific routes
const scanLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { error: "Scan limit reached." } });
const emailLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: "Email limit reached." } });

// ==========================================
// API ROUTES
// ==========================================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Save profile — accepts token OR email-based lookup
app.post("/api/save-profile", async (req, res) => {
  try {
    let userId = null;

    // Try token auth first
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token && token !== "undefined" && token !== "null") {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) userId = user.id;
    }

    // Fallback: use email from request body
    if (!userId && req.body.email) {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", req.body.email)
        .single();
      if (data) userId = data.id;
    }

    if (!userId) {
      return res.status(401).json({ error: "Could not identify user. Please sign in again." });
    }

    // Remove email from update data (don't overwrite)
    const updateData = { ...req.body };
    delete updateData.email;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) {
      // Profile doesn't exist — insert it
      const { data: inserted, error: insertErr } = await supabase
        .from("profiles")
        .insert({ id: userId, ...req.body })
        .select();
      if (insertErr) return res.status(400).json({ error: insertErr.message });
      return res.json({ profile: inserted?.[0] || null });
    }
    res.json({ profile: data[0] });
  } catch (err) {
    console.error("Save profile error:", err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// Get profile by email
app.get("/api/profile/:email", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", req.params.email)
    .single();
  if (error) return res.status(404).json({ error: "Profile not found" });
  res.json(data);
});

// Save bloating log
app.post("/api/bloating-log", async (req, res) => {
  const { email, date, severity, triggers, notes } = req.body;
  if (!email || !date || !severity) return res.status(400).json({ error: "Missing fields" });

  // Find user by email
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).single();
  if (!profile) return res.status(404).json({ error: "User not found" });

  const { data, error } = await supabase.from("bloating_logs").upsert({
    user_id: profile.id, date, severity, triggers: triggers || [], notes: notes || ''
  }, { onConflict: "user_id,date" }).select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ log: data?.[0] || null });
});

// Get bloating log for a date
app.get("/api/bloating-log/:email/:date", async (req, res) => {
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", req.params.email).single();
  if (!profile) return res.json(null);

  const { data } = await supabase.from("bloating_logs").select("*")
    .eq("user_id", profile.id).eq("date", req.params.date).single();
  res.json(data);
});

// Get bloating history (last 14 days)
app.get("/api/bloating-history/:email", async (req, res) => {
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", req.params.email).single();
  if (!profile) return res.json([]);
  const { data } = await supabase.from("bloating_logs").select("*")
    .eq("user_id", profile.id).order("date", { ascending: false }).limit(14);
  res.json(data || []);
});

// Save steps
app.post("/api/steps", async (req, res) => {
  const { email, date, steps } = req.body;
  if (!email || !date) return res.status(400).json({ error: "Missing fields" });
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).single();
  if (!profile) return res.status(404).json({ error: "User not found" });
  const { data, error } = await supabase.from("step_logs").upsert(
    { user_id: profile.id, date, steps: steps || 0 },
    { onConflict: "user_id,date" }
  ).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ log: data?.[0] || null });
});

// Get steps history
app.get("/api/steps/:email", async (req, res) => {
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", req.params.email).single();
  if (!profile) return res.json([]);
  const { data } = await supabase.from("step_logs").select("*")
    .eq("user_id", profile.id).order("date", { ascending: false }).limit(31);
  res.json(data || []);
});

// Get meals for a day
app.get("/api/meals/:day", async (req, res) => {
  const day = parseInt(req.params.day) || 1;
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("day_number", day)
    .order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Get all workouts
app.get("/api/workouts", async (req, res) => {
  const { data, error } = await supabase.from("workouts").select("*").order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Get all recipes
app.get("/api/recipes", async (req, res) => {
  const { data, error } = await supabase.from("gut_health_recipes").select("*").order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Check scan count for a user today
app.get("/api/scan-count/:email", async (req, res) => {
  const { data: profile } = await supabase.from("profiles").select("id,premium_until").eq("email", req.params.email).single();
  if (!profile) return res.json({ used: 0, limit: 3, premium: false });
  const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase.from("meal_logs").select("id", { count: "exact" })
    .eq("user_id", profile.id).eq("date", today).eq("source", "scan");
  const limit = isPremium ? 10 : 3;
  res.json({ used: count || 0, limit, premium: isPremium });
});

app.post("/api/scan-plate", scanLimiter, async (req, res) => {
  if (!openai) return res.status(503).json({ error: "AI scanning not configured." });
  const { imageUrl, imageBase64 } = req.body;
  if (!imageUrl && !imageBase64) return res.status(400).json({ error: "Image is required" });
  const imageContent = imageBase64
    ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
    : { type: "image_url", image_url: { url: imageUrl } };

  // Check scan limit — use email from body or token
  const email = req.body.email;
  let userId = null;
  if (email) {
    const { data: p } = await supabase.from("profiles").select("id").eq("email", email).single();
    if (p) userId = p.id;
  }
  if (!userId) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }
  }
  const { data: profile } = userId ? await supabase.from("profiles").select("id,premium_until").eq("id", userId).single() : { data: null };
  if (profile) {
    const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();
    const today = new Date().toISOString().split("T")[0];
    const { count } = await supabase.from("meal_logs").select("id", { count: "exact" })
      .eq("user_id", profile.id).eq("date", today).eq("source", "scan");
    const limit = isPremium ? 10 : 3;
    if ((count || 0) >= limit) {
      return res.status(429).json({
        error: isPremium
          ? "Daily scan limit reached (10/day). Try again tomorrow."
          : "Free scan limit reached (3 total). Upgrade to Premium for 10 scans/day."
      });
    }
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a nutrition analysis assistant. Analyze food photos and return nutritional estimates. Always respond with valid JSON only, no markdown." },
        { role: "user", content: [
          { type: "text", text: 'Identify all food items on this plate. For each item return: name, portion, calories, protein_g, carbs_g, fat_g. Return JSON: {"items": [...]}' },
          imageContent
        ]}
      ],
      max_tokens: 1000,
    });
    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    const items = parsed.items || [];
    const total = {
      calories: items.reduce((s, i) => s + (i.calories || 0), 0),
      protein_g: items.reduce((s, i) => s + (i.protein_g || 0), 0),
      carbs_g: items.reduce((s, i) => s + (i.carbs_g || 0), 0),
      fat_g: items.reduce((s, i) => s + (i.fat_g || 0), 0),
    };
    res.json({ items, total });
  } catch (error) {
    console.error("Scan error:", error.message);
    res.status(500).json({ error: "Failed to analyze image." });
  }
});

app.post("/api/send-welcome-email", emailLimiter, async (req, res) => {
  const { email, name, lang } = req.body;
  if (!email || !name) return res.status(400).json({ error: "Email and name are required" });
  try {
    await sendWelcomeEmail(email, name, lang || "en");
    res.json({ message: "Welcome email sent" });
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ==========================================
// Save meal log
app.post("/api/save-meal", async (req, res) => {
  const { email, date, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, meal_type } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).single();
  if (!profile) return res.status(404).json({ error: "User not found" });
  const { data, error } = await supabase.from("meal_logs").insert({
    user_id: profile.id, date: date || new Date().toISOString().split("T")[0],
    food_items: food_items || [], total_calories, total_protein_g, total_carbs_g, total_fat_g,
    source: source || "manual", meal_type: meal_type || "other"
  }).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ meal: data?.[0] || null });
});

// PROMO CODES
const PROMO_CODES = {
  "DAILYBITE2026": { type: "lifetime", description: "Founding team - lifetime free" },
  "FRIENDS100": { type: "30days", description: "Friends & family - 30 days free" },
  "BETA2026": { type: "90days", description: "Beta tester - 90 days free" },
  "RUTHY": { type: "lifetime", description: "Owner - lifetime free" },
};

app.post("/api/redeem-code", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code required" });
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return res.status(400).json({ error: "Invalid promo code" });
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).single();
  if (!profile) return res.status(404).json({ error: "User not found. Please sign up first." });
  let premiumUntil = null;
  if (promo.type === "lifetime") premiumUntil = "2099-12-31";
  else if (promo.type === "30days") premiumUntil = new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0];
  else if (promo.type === "90days") premiumUntil = new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0];
  const { error } = await supabase.from("profiles").update({ premium_until: premiumUntil, promo_code: code.toUpperCase() }).eq("id", profile.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, type: promo.type, premium_until: premiumUntil, description: promo.description });
});

app.get("/api/check-premium/:email", async (req, res) => {
  const { data: profile } = await supabase.from("profiles").select("premium_until,promo_code").eq("email", req.params.email).single();
  if (!profile) return res.json({ premium: false });
  const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();
  res.json({ premium: isPremium, until: profile.premium_until, code: profile.promo_code });
});

// STATIC FILES + SPA FALLBACK
// ==========================================
app.use(express.static(path.join(__dirname, "dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ==========================================
// START
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DailyBite API running on port ${PORT}`);
  console.log(`AI scanning: ${openai ? "enabled" : "disabled"}`);
});

