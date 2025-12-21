const About = require("../models/About");

// GET (singleton)
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE / UPDATE (singleton)
exports.createAbout = async (req, res) => {
  try {
    const existing = await About.findOne();

    const data = {
      name: req.body.name || existing?.name || "",
      title: req.body.title || existing?.title || "",
      bio: req.body.bio || existing?.bio || "",
      email: req.body.email || existing?.email || "",
      phone: req.body.phone || existing?.phone || "",
      location: req.body.location || existing?.location || "",

      socialLinks: {
        linkedin:
          req.body.linkedin || existing?.socialLinks?.linkedin || "",
        github:
          req.body.github || existing?.socialLinks?.github || "",
      },

      profileImage:
        req.body.profileImage || existing?.profileImage || "",
      resume:
        req.body.resume || existing?.resume || "",
    };

    const about = existing
      ? await About.findByIdAndUpdate(existing._id, data, { new: true })
      : await About.create(data);

    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (singleton)
exports.deleteAbout = async (req, res) => {
  try {
    await About.deleteMany({});
    res.json({ message: "About deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
