const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  message: { type: String },
  image: { type: String }, // URL to uploaded image
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", TestimonialSchema);
