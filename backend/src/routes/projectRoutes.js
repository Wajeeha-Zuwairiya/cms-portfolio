const router = require("express").Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");

router.get("/", projectController.getProjects);
router.post("/", auth, projectController.createProject);
router.put("/:id", auth, projectController.updateProject);
router.delete("/:id", auth, projectController.deleteProject);

module.exports = router;
