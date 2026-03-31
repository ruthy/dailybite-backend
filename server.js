require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { sendWelcomeEmail } = require("./emailService");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const JWT_SECRET = process.env.JWT_SECRET || "dailybite-secret-key";

// In-memory user store (replace with a database in production)
const users = [];

// Sign Up
app.post("/api/register", async (req, res) => {
  const { name, email, password, lang } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, email, password: hashedPassword });

    await sendWelcomeEmail(email, name, lang || "en");
    res.json({ message: "Registration successful. Welcome email sent!" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Sign In
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ message: "Login successful", token, name: user.name });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
