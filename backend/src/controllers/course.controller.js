const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const courseService = require("../services/course.service");

const getCourses = asyncHandler(async (req, res) => {
  const data = await courseService.getCourses(req.query.search);
  res.status(200).json({ success: true, data });
});

const getCourseBySlug = asyncHandler(async (req, res) => {
  const data = await courseService.getCourseBySlug(req.params.slug);
  if (!data) throw new ApiError(404, "Course not found");
  res.status(200).json({ success: true, data });
});

const createCourse = asyncHandler(async (req, res) => {
  const data = await courseService.createCourse(req.validated.body);
  res.status(201).json({ success: true, data });
});

const updateCourse = asyncHandler(async (req, res) => {
  const data = await courseService.updateCourse(req.params.id, req.body);
  res.status(200).json({ success: true, data });
});

const createLesson = asyncHandler(async (req, res) => {
  const data = await courseService.createLesson(req.params.courseId, req.validated.body);
  res.status(201).json({ success: true, data });
});

const upsertProgress = asyncHandler(async (req, res) => {
  const data = await courseService.upsertProgress(req.user.id, req.validated.body);
  res.status(200).json({ success: true, data });
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  createLesson,
  upsertProgress,
};
