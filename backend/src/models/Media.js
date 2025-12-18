const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      enum: ["hero", "services", "experience", "testimonials"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
