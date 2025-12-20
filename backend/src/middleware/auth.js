// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. Use the name "token" (we will set this in the controller below)
  const token = req.cookies?.token; 

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // 2. Use the exact variable from your .env
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
