require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

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

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
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

// File Upload Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/upload/image", upload.single("file"), (req, res) => {
  res.json({ url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
