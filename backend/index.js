require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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

// Email configuration
const createTransporter = () => {
  // Check if email credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("No email credentials found. Running in development mode.");
    return null;
  }

  try {
    // Try Gmail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test the connection
    transporter.verify((error, success) => {
      if (error) {
        console.log("Email configuration error:", error.message);
        console.log("Please check your Gmail settings:");
        console.log("1. Enable 2-Step Verification");
        console.log("2. Generate an App Password");
        console.log("3. Use the App Password instead of your regular password");
      } else {
        console.log("Email server is ready to send messages");
      }
    });

    return transporter;
  } catch (error) {
    console.log("Failed to create email transporter:", error.message);
    return null;
  }
};

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
        .json({ error: "Username, email, and password are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Create new user (password will be hashed automatically)
    const user = new User({ username, email, password });
    await user.save();
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
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Compare password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
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
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Send email
    try {
      const transporter = createTransporter();

      if (!transporter) {
        // Development mode - log the email content
        console.log("=== DEVELOPMENT MODE - EMAIL CONTENT ===");
        console.log("To:", email);
        console.log("Subject: Password Reset Request - Jordan Apps | AuthFlow");
        console.log("Reset URL:", resetUrl);
        console.log("=========================================");
        return res.json({ message: "Password reset email sent successfully" });
      }

      const emailContent = `
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>Jordan Apps | AuthFlow</p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER || "noreply@authflow.com",
        to: email,
        subject: "Password Reset Request - Jordan Apps | AuthFlow",
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      res.json({ message: "Password reset email sent successfully" });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Log the reset URL for development
      console.log("=== EMAIL FAILED - RESET URL ===");
      console.log("Reset URL:", resetUrl);
      console.log("===============================");
      res.json({ message: "Password reset email sent successfully" });
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
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    res.json({ email: user.email });
  } catch (error) {
    console.error("Verify token error:", error);
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
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    // Update password (will be hashed automatically)
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
