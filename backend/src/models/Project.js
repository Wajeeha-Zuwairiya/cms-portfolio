const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String },  // optional project link
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);

