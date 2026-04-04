const asyncHandler = require("../utils/asyncHandler");
const configuratorService = require("../services/configurator.service");

const recommend = asyncHandler(async (req, res) => {
  const data = await configuratorService.recommendRobot(req.validated.body);
  res.status(200).json({ success: true, data });
});

module.exports = { recommend };
