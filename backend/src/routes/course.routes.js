const express = require("express");
const courseController = require("../controllers/course.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { courseSchema, lessonSchema, progressSchema } = require("../validations/course.validation");

const router = express.Router();

router.get("/", courseController.getCourses);
router.get("/:slug", courseController.getCourseBySlug);
router.post("/", protect, authorize("ADMIN"), validate(courseSchema), courseController.createCourse);
router.patch("/:id", protect, authorize("ADMIN"), courseController.updateCourse);
router.post("/:courseId/lessons", protect, authorize("ADMIN"), validate(lessonSchema), courseController.createLesson);
router.post("/progress", protect, validate(progressSchema), courseController.upsertProgress);

module.exports = router;
