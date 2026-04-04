const { hash, compare, generateToken } = require("../utils/auth");
const prisma = require("../utils/prisma");
const ApiError = require("../utils/apiError");

const signToken = (userId) => generateToken({ userId, iat: Date.now() });

const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = hash(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return { user, token: signToken(user.id) };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const matched = compare(password, user.passwordHash);
  if (!matched) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: signToken(user.id),
  };
};

module.exports = { register, login };
