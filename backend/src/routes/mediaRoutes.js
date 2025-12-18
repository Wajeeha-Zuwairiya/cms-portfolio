const express = require("express");
const multer = require("multer");
const {
  getMedia,
  uploadMedia,
  deleteMedia,
} = require("../controllers/mediaController");

const router = express.Router();

const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"), // src/uploads
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
router.get("/", getMedia);
router.post("/", upload.single("file"), uploadMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
