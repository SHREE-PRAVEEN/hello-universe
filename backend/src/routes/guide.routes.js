const express = require("express");
const guideController = require("../controllers/guide.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { guideSchema } = require("../validations/guide.validation");

const router = express.Router();

router.get("/", guideController.getGuides);
router.get("/:slug", guideController.getGuideBySlug);
router.post("/", protect, validate(guideSchema), guideController.createGuide);

module.exports = router;
