import express from "express";  // Import thư viện express để sử dụng các chức năng liên quan đến routing
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controller/cart.controller.js";  // Import các hàm xử lý từ controller cart
import { protectRoute } from "../middleware/auth.middleware.js";  // Import middleware kiểm tra bảo mật (xác thực quyền truy cập)

const router = express.Router();  // Khởi tạo một router mới từ express

// Định nghĩa route để lấy danh sách sản phẩm trong giỏ hàng (GET request) - yêu cầu phải có token hợp lệ
router.get("/", protectRoute, getCartProducts);

// Định nghĩa route để thêm sản phẩm vào giỏ hàng (POST request) - yêu cầu phải có token hợp lệ
router.post("/", protectRoute, addToCart);

// Định nghĩa route để xóa tất cả sản phẩm khỏi giỏ hàng (DELETE request) - yêu cầu phải có token hợp lệ
router.delete("/", protectRoute, removeAllFromCart);

// Định nghĩa route để cập nhật số lượng sản phẩm trong giỏ hàng (PUT request) - yêu cầu phải có token hợp lệ
router.put("/:id", protectRoute, updateQuantity);

export default router;  // Xuất router để sử dụng trong các file khác
