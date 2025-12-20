const Blog = require("../models/Blog");

// GET all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, link, image } = req.body;

    const blog = await Blog.create({
      title,
      description,
      link,
      image, // ✅ Cloudinary URL
    });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, link, image } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(link && { link }),
      ...(image && { image }), // ✅ Replace Cloudinary URL if changed
    };

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE blog
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
