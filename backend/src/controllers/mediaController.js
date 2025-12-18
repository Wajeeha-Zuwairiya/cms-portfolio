const Media = require("../models/Media");
const fs = require("fs");
const path = require("path");

// GET all media
exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPLOAD media (1 image per section)
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { section } = req.body;

    if (!section) {
      return res.status(400).json({ message: "Section is required" });
    }

    // 🔥 Find existing image for section
    const existing = await Media.findOne({ section });

    if (existing) {
      // delete old file
      const oldPath = path.join(
        __dirname,
        "../uploads",
        path.basename(existing.url)
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      // delete db record
      await Media.findByIdAndDelete(existing._id);
    }

    // save new image
    const media = await Media.create({
      section,
      url: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE media
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(media.url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Media deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
