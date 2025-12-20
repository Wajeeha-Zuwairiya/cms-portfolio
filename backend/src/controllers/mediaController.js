const Media = require("../models/Media");

// GET all media
exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE / REPLACE media (1 image per section)
exports.uploadMedia = async (req, res) => {
  try {
    const { section, url } = req.body;

    if (!section || !url) {
      return res.status(400).json({ message: "Section and URL are required" });
    }

    // remove existing media for section
    const existing = await Media.findOne({ section });
    if (existing) {
      await Media.findByIdAndDelete(existing._id);
    }

    const media = await Media.create({
      section,
      url, // ✅ Cloudinary URL
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

    // ❌ No filesystem delete (Cloudinary handles storage)
    await Media.findByIdAndDelete(req.params.id);

    res.json({ message: "Media deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
