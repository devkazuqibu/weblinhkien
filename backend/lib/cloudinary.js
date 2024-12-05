import { v2 as cloudinary } from "cloudinary"; // Import thư viện Cloudinary (phiên bản 2)
import dotenv from "dotenv"; // Import thư viện dotenv để quản lý biến môi trường

dotenv.config(); // Tải các biến môi trường từ tệp `.env`

// Cấu hình Cloudinary với các thông tin từ biến môi trường
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên cloud của tài khoản Cloudinary
	api_key: process.env.CLOUDINARY_API_KEY,       // API key của tài khoản
	api_secret: process.env.CLOUDINARY_API_SECRET, // API secret của tài khoản
});

export default cloudinary; // Xuất module để sử dụng trong các phần khác của ứng dụng
