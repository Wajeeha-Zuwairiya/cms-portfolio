const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL to uploaded image
  link: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Blog", BlogSchema);
