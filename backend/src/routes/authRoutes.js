const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");
const { updateAdmin } = require("../controllers/authController");

// JWT utils
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET || "accesssecret", {
    expiresIn: "15m",
  });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET || "refreshsecret", {
    expiresIn: "7d",
  });

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ msg: "Logged in" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// REFRESH
router.post("/refresh", (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ msg: "No refresh token" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || "refreshsecret"
    );

    const newAccessToken = generateAccessToken(decoded.id);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ msg: "Token refreshed" });
  } catch {
    res.status(403).json({ msg: "Invalid refresh token" });
  }
});


router.put("/update", auth, updateAdmin);

router.get("/me", auth, async (req, res) => {
  const admin = await Admin.findById(req.userId).select("-password");
  if (!admin) return res.status(404).json({ msg: "Admin not found" });
  res.json(admin);
});


module.exports = router;
