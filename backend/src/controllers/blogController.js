const Blog = require("../models/Blog");

// GET all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const image = req.file ? req.file.filename : ""; // multer will set req.file
    const blog = await Blog.create({ title, description, link, image });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const updateData = { title, description, link };
    if (req.file) updateData.image = req.file.filename;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

