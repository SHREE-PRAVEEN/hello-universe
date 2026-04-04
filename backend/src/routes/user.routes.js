const express = require("express");
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);
router.get("/me", userController.getMe);
router.patch("/me", userController.updateMe);
router.post("/saved-items", userController.saveItem);

module.exports = router;
