const express = require("express");
const orderController = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { orderSchema } = require("../validations/order.validation");

const router = express.Router();

router.use(protect);
router.get("/me", orderController.getMyOrders);
router.post("/", validate(orderSchema), orderController.createOrder);

module.exports = router;
