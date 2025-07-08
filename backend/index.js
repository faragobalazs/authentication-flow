require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
const nodemailer = require("nodemailer");
const User = require("./models/User");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// MongoDB connection with Mongoose
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Email config (set these in .env for production)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = process.env.EMAIL_PORT || 587;

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB with Mongoose!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// User registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email and password are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    // Create new user (password will be hashed by pre-save hook)
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    // Find user by username only
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Forgot password endpoint
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Generate JWT token with reset token
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        resetToken: resetToken,
        type: "password-reset",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${jwtToken}`;

    // Send email if transporter is configured
    if (transporter) {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
      });
      res.json({ message: "Password reset email sent" });
    } else {
      // Fallback: return reset URL in response (for dev/testing)
      res.json({
        message: "Password reset email sent (dev mode)",
        resetUrl,
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify reset token endpoint
app.get("/api/verify-reset-token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== "password-reset") {
      return res.status(400).json({ error: "Invalid token type" });
    }

    // Find user and verify reset token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetPasswordToken !== decoded.resetToken) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: "Reset token has expired" });
    }

    res.json({
      message: "Token is valid",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset password endpoint
app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== "password-reset") {
      return res.status(400).json({ error: "Invalid token type" });
    }

    // Find user and verify reset token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetPasswordToken !== decoded.resetToken) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: "Reset token has expired" });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
