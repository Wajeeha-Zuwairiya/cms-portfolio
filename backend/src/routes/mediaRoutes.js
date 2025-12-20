const express = require("express");

const {
  getMedia,
  uploadMedia,
  deleteMedia,
} = require("../controllers/mediaController");

const router = express.Router();


router.get("/", getMedia);
router.post("/", upload.single("file"), uploadMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
