const multer = require("multer");
const path = require("path");

const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


/* -----------------------------
   Storage configuration
----------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/* -----------------------------
   File validation
----------------------------- */
const fileFilter = (req, file, cb) => {
  // Resume validation
  if (file.fieldname === "resume") {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, DOC, or DOCX files are allowed for resume"),
        false
      );
    }
  }

  // Profile image validation
  if (file.fieldname === "profileImage") {
    const allowedImages = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedImages.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, or WEBP images are allowed"),
        false
      );
    }
  }

  cb(null, true);
};

/* -----------------------------
   Multer instance
----------------------------- */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = upload;
