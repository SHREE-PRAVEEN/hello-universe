const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/user.service");

const getMe = asyncHandler(async (req, res) => {
  const data = await userService.getProfile(req.user.id);
  res.status(200).json({ success: true, data });
});

const updateMe = asyncHandler(async (req, res) => {
  const data = await userService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, data });
});

const saveItem = asyncHandler(async (req, res) => {
  const data = await userService.saveItem(req.user.id, req.body);
  res.status(201).json({ success: true, data });
});

module.exports = { getMe, updateMe, saveItem };
