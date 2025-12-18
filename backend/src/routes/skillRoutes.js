const router = require("express").Router();
const skillController = require("../controllers/skillController");
const auth = require("../middleware/auth");

router.get("/", skillController.getSkills);
router.post("/", auth, skillController.createSkill);
router.put("/:id", auth, skillController.updateSkill);
router.delete("/:id", auth, skillController.deleteSkill);

module.exports = router;
