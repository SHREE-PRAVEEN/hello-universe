const prisma = require("../utils/prisma");
const ApiError = require("../utils/apiError");

const createOrder = async (userId, items) => {
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== items.length) {
    throw new ApiError(400, "One or more products were not found");
  }

  let totalAmount = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    totalAmount += Number(product.price) * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });

  return prisma.order.create({
    data: {
      userId,
      totalAmount,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

const getMyOrders = async (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

module.exports = { createOrder, getMyOrders };
