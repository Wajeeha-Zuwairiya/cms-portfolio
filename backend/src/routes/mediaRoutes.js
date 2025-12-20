const express = require("express");
const auth = require("../middleware/auth");

const {
  getMedia,
  uploadMedia,
  deleteMedia,
} = require("../controllers/mediaController");

const router = express.Router();


router.get("/", getMedia);
router.post("/",auth, mediaController.uploadMedia);
router.delete("/:id",auth, deleteMedia);

module.exports = router;
