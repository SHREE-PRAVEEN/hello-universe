const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const courseRoutes = require("./course.routes");
const solutionRoutes = require("./solution.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const guideRoutes = require("./guide.routes");
const configuratorRoutes = require("./configurator.routes");

const router = express.Router();

// API v1 module routes.
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/solutions", solutionRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/guides", guideRoutes);
router.use("/configurator", configuratorRoutes);

module.exports = router;
