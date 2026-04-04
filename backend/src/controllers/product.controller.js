const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const productService = require("../services/product.service");

const getProducts = asyncHandler(async (req, res) => {
  const data = await productService.getProducts(req.query);
  res.status(200).json({ success: true, data });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const data = await productService.getProductBySlug(req.params.slug);
  if (!data) throw new ApiError(404, "Product not found");
  res.status(200).json({ success: true, data });
});

const createProduct = asyncHandler(async (req, res) => {
  const data = await productService.createProduct(req.validated.body);
  res.status(201).json({ success: true, data });
});

const addToCart = asyncHandler(async (req, res) => {
  const data = await productService.addToCart(req.user.id, req.validated.body);
  res.status(201).json({ success: true, data });
});

const getMyCart = asyncHandler(async (req, res) => {
  const data = await productService.getMyCart(req.user.id);
  res.status(200).json({ success: true, data });
});

const addReview = asyncHandler(async (req, res) => {
  const data = await productService.addReview(req.user.id, req.params.productId, req.validated.body);
  res.status(201).json({ success: true, data });
});

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  addToCart,
  getMyCart,
  addReview,
};
