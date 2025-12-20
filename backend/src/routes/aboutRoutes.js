const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");
const auth = require("../middleware/auth");

// GET single About
router.get("/", aboutController.getAbout);

// CREATE or UPDATE singleton
// NOTE: We REMOVED the upload.fields middleware here
router.post("/", auth, aboutController.createAbout);

// DELETE singleton
router.delete("/", auth, aboutController.deleteAbout);

module.exports = router;
