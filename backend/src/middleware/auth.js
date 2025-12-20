const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.accessToken; // ✅ FIXED

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
