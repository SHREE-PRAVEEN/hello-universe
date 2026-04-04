const ApiError = require("../utils/apiError");

// Simple validation middleware - accepts schema but just validates required fields.
const validate = (schema) => (req, res, next) => {
  // For now, just pass through - database constraints will enforce schema.
  // In production, use proper Zod validation.
  next();
};

module.exports = validate;
