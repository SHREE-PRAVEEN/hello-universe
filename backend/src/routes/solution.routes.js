const express = require("express");
const solutionController = require("../controllers/solution.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { solutionSchema } = require("../validations/solution.validation");

const router = express.Router();

router.get("/", solutionController.getSolutions);
router.get("/:slug", solutionController.getSolutionBySlug);
router.post("/", protect, authorize("ADMIN"), validate(solutionSchema), solutionController.createSolution);

module.exports = router;
