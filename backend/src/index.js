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
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // This handles the pre-flight check
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

// --- BASE64 IMAGE UPLOAD CONFIG ---
// We use memoryStorage because Vercel doesn't allow writing to disk
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per image
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

// The actual upload endpoint used by your Admin Panel
app.post("/upload/image", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    // Convert image buffer to a Base64 string
    const base64String = req.file.buffer.toString("base64");
    const imageUrl = `data:${req.file.mimetype};base64,${base64String}`;

    // Return the string to the frontend so it can be saved in the DB
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ msg: "Error processing image" });
  }
});

// --- EXPORT FOR VERCEL ---
module.exports = app;

// --- LOCAL START ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}
