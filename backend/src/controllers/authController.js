const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// Create Admin (one-time use)
exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const admin = new Admin({ email, password });
    await admin.save();

    res.status(201).json({ msg: "Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.userId; //  FIX HERE

    const { username, email, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    // Change password
    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ msg: "Current password required" });

      const match = await bcrypt.compare(currentPassword, admin.password);
      if (!match)
        return res.status(401).json({ msg: "Incorrect current password" });

      admin.password = newPassword; // auto-hashed
    }

    if (username) admin.username = username;
    if (email) admin.email = email;

    await admin.save();

    res.json({ msg: "Admin updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


