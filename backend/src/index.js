require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const contactRoutes = require("./routes/contactRoutes");
const mediaRoutes = require("./routes/mediaRoutes");

const app = express();
app.set("trust proxy", 1);
// Add this at the top of your routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- MIDDLEWARES ---
const allowedOrigins = [
  "https://wajeehazuwairiya.vercel.app", // Add this explicitly
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
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ IMPORTANT: SAME OPTIONS

app.use(cookieParser());

// IMPORTANT: Increase JSON limit because Base64 strings are large
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// --- MONGODB CONNECTION (Serverless Optimized) ---
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// The actual upload endpoint used by your Admin Panel
const cloudinary = require("cloudinary").v2;

// Add your credentials (ensure these are in your Vercel/Local .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- ROUTES ---
app.use("/auth", authRoutes);
app.use("/about", aboutRoutes);
app.use("/skills", skillRoutes);
app.use("/projects", projectRoutes);
app.use("/blogs", blogRoutes);
app.use("/services", serviceRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/experience", experienceRoutes);
app.use("/contact", contactRoutes);
app.use("/media", mediaRoutes);
app.get("/debug/cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers.cookie || null,
  });
});


app.post("/upload/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    cloudinary.uploader.upload_stream(
      { 
        folder: "portfolio",
        resource_type: "auto" // 👈 Add this to allow PDFs (Resume)
      }, 
      (error, result) => {
        if (error) return res.status(500).json({ msg: "Upload Error", error });
        res.json({ url: result.secure_url }); // This returns the permanent https link
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ msg: "Error processing image", error });
  }
});

// --- EXPORT FOR VERCEL ---
module.exports = app;

// --- LOCAL START ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}
