const router = require("express").Router();
const serviceController = require("../controllers/serviceController");
const auth = require("../middleware/auth");

router.get("/", serviceController.getServices);
router.post("/", auth, serviceController.createService);
router.put("/:id", auth, serviceController.updateService);
router.delete("/:id", auth, serviceController.deleteService);

module.exports = router;
