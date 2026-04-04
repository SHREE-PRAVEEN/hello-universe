const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body);
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  res.status(200).json({ success: true, data: result });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = { register, login, logout };
