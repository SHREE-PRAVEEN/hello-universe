// Stub auth utilities for demo/dev (no external dependencies).
// In production, use bcryptjs and jsonwebtoken packages.

const crypto = require("crypto");

// Simple mock password hashing (NOT production-safe!)
const hash = (password) => {
  return crypto.createHash("sha256").update(password + "hello_universe").digest("hex");
};

const compare = (password, hash) => {
  return hash === crypto.createHash("sha256").update(password + "hello_universe").digest("hex");
};

// Simple mock JWT (NOT production-safe!)
const generateToken = (payload) => {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const sig = crypto.createHash("sha256").update(data + "hello_universe_secret").digest("hex");
  return `${data}.${sig}`;
};

const verifyToken = (token) => {
  try {
    const [data, sig] = token.split(".");
    const expectedSig = crypto.createHash("sha256").update(data + "hello_universe_secret").digest("hex");
    if (sig !== expectedSig) throw new Error("Invalid signature");
    return JSON.parse(Buffer.from(data, "base64").toString());
  } catch {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { hash, compare, generateToken, verifyToken };
