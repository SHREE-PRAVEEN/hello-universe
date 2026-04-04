const { verifyToken } = require("../utils/auth");
const prisma = require("../utils/prisma");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is missing");
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new ApiError(401, "Invalid authentication token");
    }
    req.user = user;
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
  
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not authorized to perform this action"));
  }

  next();
};

module.exports = { protect, authorize };
