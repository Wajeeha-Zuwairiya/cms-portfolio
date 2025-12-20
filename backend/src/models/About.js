const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },

    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    // ✅ Cloudinary URLs (no public_id)
    profileImage: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
