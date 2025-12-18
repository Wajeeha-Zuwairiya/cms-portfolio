const Testimonial = require("../models/Testimonial");

// GET all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE a testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, message, image } = req.body;

    if (!name || !role || !message) {
      return res.status(400).json({ error: "Name, role, and message are required" });
    }

    const testimonial = await Testimonial.create({ name, role, message, image });
    res.json(testimonial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// UPDATE a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, role, message, image } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { name, role, message, image },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (err) {
    console.error("Error updating testimonial:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ error: err.message });
  }
};
