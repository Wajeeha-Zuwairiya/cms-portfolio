const router = require("express").Router();
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");

router.get("/", blogController.getBlogs);
// REMOVED upload.single("image")
router.post("/", auth, blogController.createBlog); 
router.put("/:id", auth, blogController.updateBlog);
router.delete("/:id", auth, blogController.deleteBlog);

module.exports = router;
