const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const guideService = require("../services/guide.service");

const getGuides = asyncHandler(async (req, res) => {
  const data = await guideService.getGuides(req.query);
  res.status(200).json({ success: true, data });
});

const getGuideBySlug = asyncHandler(async (req, res) => {
  const data = await guideService.getGuideBySlug(req.params.slug);
  if (!data) throw new ApiError(404, "Guide not found");
  res.status(200).json({ success: true, data });
});

const createGuide = asyncHandler(async (req, res) => {
  const data = await guideService.createGuide(req.user.id, req.validated.body);
  res.status(201).json({ success: true, data });
});

module.exports = { getGuides, getGuideBySlug, createGuide };
