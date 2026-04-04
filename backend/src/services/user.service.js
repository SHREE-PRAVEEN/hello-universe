const prisma = require("../utils/prisma");

const getProfile = async (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      savedItems: {
        include: {
          solution: true,
          guide: true,
        },
      },
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

const updateProfile = async (userId, payload) =>
  prisma.user.update({
    where: { id: userId },
    data: payload,
    select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true },
  });

const saveItem = async (userId, payload) =>
  prisma.savedItem.create({
    data: {
      userId,
      solutionId: payload.solutionId,
      guideId: payload.guideId,
    },
  });

module.exports = { getProfile, updateProfile, saveItem };
