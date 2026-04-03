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
      "capacitor://localhost", "http://localhost:5173", "http://localhost:4173",
    ];
    if (!origin || allowed.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: "Too many requests." } }));

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

app.post("/api/scan-plate", scanLimiter, requireAuth, async (req, res) => {
  if (!openai) return res.status(503).json({ error: "AI scanning not configured." });
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a nutrition analysis assistant. Analyze food photos and return nutritional estimates. Always respond with valid JSON only, no markdown." },
        { role: "user", content: [
          { type: "text", text: 'Identify all food items on this plate. For each item return: name, portion, calories, protein_g, carbs_g, fat_g. Return JSON: {"items": [...]}' },
          { type: "image_url", image_url: { url: imageUrl } }
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
