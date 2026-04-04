const prisma = require("../utils/prisma");
const ApiError = require("../utils/apiError");

const getProducts = async ({ category, search, tag }) =>
  prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { reviews: true },
    orderBy: { createdAt: "desc" },
  });

const getProductBySlug = async (slug) =>
  prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

const createProduct = async (payload) => prisma.product.create({ data: payload });

const addToCart = async (userId, { productId, quantity }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  return prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

const getMyCart = async (userId) =>
  prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

const addReview = async (userId, productId, payload) =>
  prisma.review.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: payload,
    create: {
      userId,
      productId,
      ...payload,
    },
  });

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  addToCart,
  getMyCart,
  addReview,
};
