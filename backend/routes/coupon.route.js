import express from "express";  // Import thư viện express để sử dụng các chức năng liên quan đến routing
import { protectRoute } from "../middleware/auth.middleware.js";  // Import middleware kiểm tra bảo mật (xác thực quyền truy cập)
import { getCoupon, validateCoupon } from "../controller/coupon.controller.js";  // Import các hàm xử lý từ controller coupon

const router = express.Router();  // Khởi tạo một router mới từ express

// Định nghĩa route GET để lấy thông tin mã giảm giá (coupon) - yêu cầu phải có token hợp lệ
router.get("/", protectRoute, getCoupon);

// Định nghĩa route POST để kiểm tra tính hợp lệ của mã giảm giá (coupon) - yêu cầu phải có token hợp lệ
router.post("/validate", protectRoute, validateCoupon);

export default router;  // Xuất router để sử dụng trong các file khác
