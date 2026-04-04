const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const solutionService = require("../services/solution.service");

const getSolutions = asyncHandler(async (req, res) => {
  const data = await solutionService.getSolutions(req.query);
  res.status(200).json({ success: true, data });
});

const getSolutionBySlug = asyncHandler(async (req, res) => {
  const data = await solutionService.getSolutionBySlug(req.params.slug);
  if (!data) throw new ApiError(404, "Solution not found");
  res.status(200).json({ success: true, data });
});

const createSolution = asyncHandler(async (req, res) => {
  const data = await solutionService.createSolution(req.validated.body);
  res.status(201).json({ success: true, data });
});

module.exports = { getSolutions, getSolutionBySlug, createSolution };
