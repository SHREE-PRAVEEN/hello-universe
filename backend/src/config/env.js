// Simple environment config (no zod dependency).
const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/hello_universe",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "cloudinary",
};

if (!env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

module.exports = env;
