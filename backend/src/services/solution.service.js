const prisma = require("../utils/prisma");

const getSolutions = async ({ category, search, tag }) =>
  prisma.solution.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { problemDescription: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { buildGuide: true },
    orderBy: { createdAt: "desc" },
  });

const getSolutionBySlug = async (slug) =>
  prisma.solution.findUnique({
    where: { slug },
    include: { buildGuide: true },
  });

const createSolution = async (payload) => prisma.solution.create({ data: payload });

module.exports = { getSolutions, getSolutionBySlug, createSolution };
