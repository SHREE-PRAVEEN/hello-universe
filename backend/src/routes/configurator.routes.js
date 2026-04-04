const express = require("express");
const configuratorController = require("../controllers/configurator.controller");
const validate = require("../middlewares/validate.middleware");
const { configuratorSchema } = require("../validations/configurator.validation");

const router = express.Router();

router.post("/recommend", validate(configuratorSchema), configuratorController.recommend);

module.exports = router;
