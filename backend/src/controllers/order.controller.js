const asyncHandler = require("../utils/asyncHandler");
const orderService = require("../services/order.service");

const createOrder = asyncHandler(async (req, res) => {
  const data = await orderService.createOrder(req.user.id, req.validated.body.items);
  res.status(201).json({ success: true, data });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const data = await orderService.getMyOrders(req.user.id);
  res.status(200).json({ success: true, data });
});

module.exports = { createOrder, getMyOrders };
