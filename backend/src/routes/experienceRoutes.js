const router = require("express").Router();
const experienceController = require("../controllers/experienceController");
const auth = require("../middleware/auth");

router.get("/", experienceController.getExperience);
router.post("/", auth, experienceController.createExperience);
router.put("/:id", auth, experienceController.updateExperience);
router.delete("/:id", auth, experienceController.deleteExperience);

module.exports = router;
