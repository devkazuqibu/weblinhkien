import express from "express";  // Import thư viện express để sử dụng các chức năng liên quan đến routing
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";  // Import middleware bảo mật (xác thực quyền truy cập)
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
} from "../controller/product.controller.js";  // Import các hàm xử lý từ controller product

const router = express.Router();  // Khởi tạo một router mới từ express

// Route GET để lấy tất cả sản phẩm - yêu cầu người dùng phải đăng nhập và có quyền admin
router.get("/", protectRoute, adminRoute, getAllProducts);

// Route GET để lấy sản phẩm nổi bật
router.get("/featured", getFeaturedProducts);

// Route GET để lấy sản phẩm theo danh mục
router.get("/category/:category", getProductsByCategory);

// Route GET để lấy sản phẩm gợi ý
router.get("/recommendations", getRecommendedProducts);

// Route POST để tạo sản phẩm mới - yêu cầu người dùng phải đăng nhập và có quyền admin
router.post("/", protectRoute, adminRoute, createProduct);

// Route PATCH để cập nhật trạng thái "featured" cho sản phẩm - yêu cầu người dùng phải đăng nhập và có quyền admin
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// Route DELETE để xóa sản phẩm - yêu cầu người dùng phải đăng nhập và có quyền admin
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;  // Xuất router để sử dụng trong các file khác
