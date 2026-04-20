
import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/farmer-trading-system",
  ORIGIN: process.env.ORIGIN || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@mail.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "123456",
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  API_KEY: process.env.API_KEY || "",
  API_SECRET: process.env.API_SECRET || "",
};

export default env;