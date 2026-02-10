// routes/admin.ts
import express from "express";
import bcrypt from "bcryptjs";
import User from "../schema/user.js"; // your User model
import { authMiddleware } from "../middleware/auth.js"; // optional: ensure admin is logged in

const router = express.Router();

// POST /api/admin/reset-password
router.post("/reset-password", authMiddleware, async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password successfully reset!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
