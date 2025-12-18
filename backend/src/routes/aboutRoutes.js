const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// GET single About
router.get("/", aboutController.getAbout);

// CREATE or UPDATE singleton
router.post(
  "/", auth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  aboutController.createAbout
);

// DELETE singleton (no :id)
router.delete("/", auth, aboutController.deleteAbout);

module.exports = router;
