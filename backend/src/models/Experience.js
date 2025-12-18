const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  year: { type: String },       // e.g., "2021–2023"
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Experience", ExperienceSchema);
