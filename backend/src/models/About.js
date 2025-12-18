const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },

  // FIXED: socialLinks is optional and flat fields allowed
  socialLinks: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
  },

  profileImage: { type: String, required: false }, // stored path
  resume: { type: String, required: false }, // stored path
});

module.exports = mongoose.model("About", AboutSchema);
