require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// ================== APP ==================
const app = express();
app.set("trust proxy", 1);

// ================== BASIC ROUTE ==================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================== CORS ==================
const allowedOrigins = [
  "https://wajeehazuwairiya.vercel.app",
  process.env.CLIENT_URL,
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Global preflight

// ================== MIDDLEWARES ==================
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ================== MONGODB ==================
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ================== CLOUDINARY ==================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================== MULTER ==================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ================== ROUTES ==================
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

// ================== DEBUG ==================
app.get("/debug/cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers.cookie || null,
  });
});

// ================== CLOUDINARY UPLOAD ==================
// ✅ IMPORTANT: Explicit OPTIONS handler (fixes CORS error)
app.options("/upload/image", cors(corsOptions));

app.post("/upload/image", upload.single("file"), async (req, res) => {
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
        (error, result) => {
          if (error) {
            return res.status(500).json({
              msg: "Cloudinary upload failed",
              error,
            });
          }

          // ✅ Only return URL (no public_id)
          res.json({ url: result.secure_url });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ msg: "Upload error", error });
  }
});

// ================== EXPORT ==================
module.exports = app;

// ================== LOCAL DEV ==================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running locally on port ${PORT}`)
  );
}
