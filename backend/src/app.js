const express = require("express");
const env = require("./config/env");
const apiV1Routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Global middlewares for security-friendly defaults and JSON APIs.
// Using Express built-in (cors fallback - no external package needed).
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Basic request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Hello Universe API healthy" });
});

app.use("/api/v1", apiV1Routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
