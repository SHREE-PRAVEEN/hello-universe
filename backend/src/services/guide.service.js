const prisma = require("../utils/prisma");

const getGuides = async ({ search, tag }) =>
  prisma.guide.findMany({
    where: {
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

const getGuideBySlug = async (slug) =>
  prisma.guide.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

const createGuide = async (authorId, payload) =>
  prisma.guide.create({
    data: {
      ...payload,
      authorId,
    },
  });

module.exports = { getGuides, getGuideBySlug, createGuide };
