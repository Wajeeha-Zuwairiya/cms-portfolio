const router = require("express").Router();
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");

const multer = require("multer");
const path = require("path");



// GET all blogs
router.get("/", blogController.getBlogs);

// CREATE blog with image
router.post("/",auth, upload.single("image"), blogController.createBlog);

// UPDATE blog with optional image
router.put("/:id",auth, upload.single("image"), blogController.updateBlog);

// DELETE blog
router.delete("/:id",auth, blogController.deleteBlog);

module.exports = router;
