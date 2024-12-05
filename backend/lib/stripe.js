import Stripe from "stripe"; // Import thư viện Stripe để làm việc với API thanh toán của Stripe
import dotenv from "dotenv"; // Import thư viện dotenv để quản lý các biến môi trường

// Cấu hình dotenv để tải các biến môi trường từ file .env
dotenv.config();

// Khởi tạo một instance Stripe với khóa bí mật (secret key) được lấy từ biến môi trường
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
