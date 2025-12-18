const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const generateToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(admin);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Refresh token
exports.refresh = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ msg: "Unauthorized" });

  const token = generateToken(admin);
  res.json({ token });
};

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


