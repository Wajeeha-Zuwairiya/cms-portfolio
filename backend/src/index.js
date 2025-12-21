require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
app.set("trust proxy", 1);

// ================= BASIC =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= ALLOWED ORIGINS =================
const ALLOWED_ORIGIN = "https://wajeehazuwairiya.vercel.app";

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || origin === ALLOWED_ORIGIN) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Global CORS (for normal routes)
app.use(cors(corsOptions));

// ================= MIDDLEWARES =================
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= MONGODB =================
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ================= CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================= MULTER =================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ================= ROUTES =================
app.use("/auth", require("./routes/authRoutes"));
app.use("/about", require("./routes/aboutRoutes"));
app.use("/skills", require("./routes/skillRoutes"));
app.use("/projects", require("./routes/projectRoutes"));
app.use("/blogs", require("./routes/blogRoutes"));
app.use("/services", require("./routes/serviceRoutes"));
app.use("/testimonials", require("./routes/testimonialRoutes"));
app.use("/experience", require("./routes/experienceRoutes"));
app.use("/contact", require("./routes/contactRoutes"));
app.use("/media", require("./routes/mediaRoutes"));

// ================= DEBUG =================
app.get("/debug/cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    raw: req.headers.cookie || null,
  });
});

// =================================================
// 🔥🔥🔥 CORS-SAFE CLOUDINARY UPLOAD (VERCEL FIX)
// =================================================

// MANUAL PREFLIGHT — REQUIRED ON VERCEL
app.options("/upload/image", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res.sendStatus(200);
});

// ACTUAL UPLOAD
app.post("/upload/image", upload.single("file"), async (req, res) => {
  // 🔥 FORCE CORS HEADERS (Vercel requirement)
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ msg: "Invalid file type" });
    }

    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: "auto",
        },
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ msg: "Cloudinary upload failed" });
          }

          // ✅ RETURN ONLY URL
          res.json({ url: result.secure_url });
        }
      )
      .end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ msg: "Upload error" });
  }
});

// ================= EXPORT =================
module.exports = app;

// ================= LOCAL DEV =================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running locally on port ${PORT}`)
  );
}
