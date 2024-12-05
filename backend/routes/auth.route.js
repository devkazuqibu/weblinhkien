import express from "express";  // Import thư viện express để sử dụng các chức năng liên quan đến routing
import { login, logout, signup, refreshToken, getProfile } from "../controller/auth.controller.js";  // Import các hàm xử lý từ controller auth
import { protectRoute } from "../middleware/auth.middleware.js";  // Import middleware kiểm tra bảo mật (xác thực quyền truy cập)

const router = express.Router();  // Khởi tạo một router mới từ express

// Định nghĩa route xử lý đăng ký tài khoản người dùng (POST request)
router.post("/signup", signup);

// Định nghĩa route xử lý đăng nhập người dùng (POST request)
router.post("/login", login);

// Định nghĩa route xử lý đăng xuất người dùng (POST request)
router.post("/logout", logout);

// Định nghĩa route xử lý làm mới token (POST request)
router.post("/refresh-token", refreshToken);

// Định nghĩa route lấy thông tin hồ sơ người dùng (GET request) - yêu cầu phải có token hợp lệ
router.get("/profile", protectRoute, getProfile);  // 'protectRoute' là middleware kiểm tra token hợp lệ

export default router;  // Xuất router để sử dụng trong các file khác
