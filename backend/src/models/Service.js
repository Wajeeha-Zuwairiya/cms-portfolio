const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
   icon: { type: String, default: "FaServicestack" },
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema);
