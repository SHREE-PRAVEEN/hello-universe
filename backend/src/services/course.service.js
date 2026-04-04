const prisma = require("../utils/prisma");

const getCourses = async (search) =>
  prisma.course.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      lessons: true,
    },
    orderBy: { createdAt: "desc" },
  });

const getCourseBySlug = async (slug) =>
  prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

const createCourse = async (payload) => prisma.course.create({ data: payload });

const updateCourse = async (id, payload) => prisma.course.update({ where: { id }, data: payload });

const createLesson = async (courseId, payload) => prisma.lesson.create({ data: { ...payload, courseId } });

const upsertProgress = async (userId, payload) =>
  prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: payload.lessonId,
      },
    },
    update: {
      completed: payload.completed,
      percent: payload.percent,
    },
    create: {
      userId,
      lessonId: payload.lessonId,
      completed: payload.completed,
      percent: payload.percent,
    },
  });

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  createLesson,
  upsertProgress,
};
