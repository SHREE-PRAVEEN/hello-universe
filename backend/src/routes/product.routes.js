const express = require("express");
const productController = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { productSchema, cartItemSchema, reviewSchema } = require("../validations/product.validation");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/cart/me", protect, productController.getMyCart);
router.post("/cart/items", protect, validate(cartItemSchema), productController.addToCart);

router.get("/:slug", productController.getProductBySlug);
router.post("/", protect, authorize("ADMIN"), validate(productSchema), productController.createProduct);

router.post("/:productId/reviews", protect, validate(reviewSchema), productController.addReview);

module.exports = router;
