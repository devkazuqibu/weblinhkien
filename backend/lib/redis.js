import Redis from "ioredis"; // Import thư viện ioredis để làm việc với Redis
import dotenv from "dotenv"; // Import thư viện dotenv để quản lý biến môi trường

// Cấu hình dotenv để lấy biến môi trường từ file .env
dotenv.config();

// Tạo một instance Redis để kết nối tới Redis server
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
