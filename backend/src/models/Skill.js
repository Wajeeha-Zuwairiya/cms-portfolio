const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String }, // e.g., Beginner, Intermediate, Expert
  icon: { type: String },  // e.g., "FaReact", "FaNodeJs", "FaHtml5"
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);
