const About = require("../models/About");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "uploads");

const deleteFileIfExists = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// GET (single About)
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST (CREATE OR UPDATE – singleton)
exports.createAbout = async (req, res) => {
  try {
    const existing = await About.findOne();

    const data = {
      name: req.body.name ?? existing?.name,
      title: req.body.title ?? existing?.title,
      bio: req.body.bio ?? existing?.bio,
      email: req.body.email ?? existing?.email,
      phone: req.body.phone ?? existing?.phone,
      location: req.body.location ?? existing?.location,
    };

    // SOCIAL LINKS (SAFE)
    data.socialLinks = {
  linkedin: req.body.linkedin ?? existing?.socialLinks?.linkedin ?? "",
  github: req.body.github ?? existing?.socialLinks?.github ?? "",
};


    // PROFILE IMAGE
    if (req.files?.profileImage?.[0]) {
      if (existing?.profileImage) deleteFileIfExists(existing.profileImage);
      data.profileImage = req.files.profileImage[0].filename;
    } else if (existing) {
      data.profileImage = existing.profileImage;
    }

    // RESUME
    if (req.files?.resume?.[0]) {
      if (existing?.resume) deleteFileIfExists(existing.resume);
      data.resume = req.files.resume[0].filename;
    } else if (existing) {
      data.resume = existing.resume;
    }

    const about = existing
      ? await About.findByIdAndUpdate(existing._id, data, { new: true })
      : await About.create(data);

    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE (delete the single About)
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    deleteFileIfExists(about.profileImage);
    deleteFileIfExists(about.resume);

    await About.findByIdAndDelete(about._id);

    res.json({ message: "About deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
