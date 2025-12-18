const Skill = require("../models/Skill");

// GET all skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error("GET /skills error:", err);
    res.status(500).json({ msg: "Failed to get skills", error: err.message });
  }
};

// CREATE new skill
exports.createSkill = async (req, res) => {
  try {
    const { name, level, icon } = req.body;
    const skill = await Skill.create({ name, level, icon });
    res.status(201).json(skill);
  } catch (err) {
    console.error("POST /skills error:", err);
    res.status(400).json({ message: "Error creating skill", error: err.message });
  }
};

// UPDATE a skill
exports.updateSkill = async (req, res) => {
  try {
    const { name, level, icon } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, level, icon },
      { new: true }
    );
    res.json(skill);
  } catch (err) {
    console.error("PUT /skills/:id error:", err);
    res.status(400).json({ message: "Error updating skill", error: err.message });
  }
};

// DELETE a skill
exports.deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("DELETE /skills/:id error:", err);
    res.status(400).json({ message: "Error deleting skill", error: err.message });
  }
};
