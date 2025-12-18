const Experience = require("../models/Experience");

exports.getExperience = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);  // ✅ FIXED
    res.json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
