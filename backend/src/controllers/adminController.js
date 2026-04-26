import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env.js";
import { sendEmail } from "../utils/email.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        name: admin.name,
        email: admin.email,
        id: admin._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    // If user not found, send error message
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found", success: false });
    }

    // Generate a unique JWT token for the admin that contains admin id
    const token = jwt.sign({ id: admin._id }, env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Hash the token for security
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Store the hashed token and expiration in the database
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    // Email configuration
    const mailOptions = {
      from: env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
    <p>Click on the following link to reset your password:</p>
    <a href="${env.ORIGIN}/reset-password/${token}">${env.ORIGIN}/reset-password/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    sendEmail(
      mailOptions.from,
      mailOptions.to,
      mailOptions.subject,
      mailOptions.html,
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link sent to your email",
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Hash the received token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user by the hashed token and check if token hasn't expired
    const user = await Admin.findOne({ 
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Verify the JWT token as additional security
    const decodedToken = jwt.verify(req.params.token, env.JWT_SECRET);
    if (decodedToken.id.toString() !== user._id.toString()) {
      return res.status(401).json({ success: false, message: "Token mismatch" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update user's password, clear reset token and expiration time
    user.password = hashedNewPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send success response
    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    // Send error response if any error occurs
    res.status(500).json({ success: false, message: err.message });
  }
};
