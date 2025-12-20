const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController"); // Import the whole object
const auth = require("../middleware/auth");
const multer = require("multer");

// Use memory storage for Vercel compatibility
const storage = multer.memoryStorage();
const upload = multer({ storage });

// UPDATE THESE LINES to use mediaController.functionName
router.get("/", mediaController.getMedia);
router.post("/", auth, upload.single("file"), mediaController.uploadMedia);
router.delete("/:id", auth, mediaController.deleteMedia);

module.exports = router;
