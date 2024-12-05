import express from "express";                                // Import express để sử dụng các chức năng của nó
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"; // Import middleware kiểm tra bảo mật và quyền admin
import { getAnalyticsData, getDailySalesData } from "../controller/analytics.controller.js"; // Import các hàm từ controller xử lý phân tích và doanh thu

const router = express.Router(); // Khởi tạo một router mới

// Định nghĩa route cho endpoint "/"
router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		// Lấy dữ liệu phân tích tổng thể
		const analyticsData = await getAnalyticsData();

		// Tính toán ngày hiện tại và ngày bắt đầu của tuần trước (7 ngày trước)
		const endDate = new Date();  // Ngày kết thúc là ngày hiện tại
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);  // Ngày bắt đầu là 7 ngày trước

		// Lấy dữ liệu doanh thu hàng ngày trong tuần trước
		const dailySalesData = await getDailySalesData(startDate, endDate);

		// Trả về dữ liệu phân tích và doanh thu hàng ngày dưới dạng JSON
		res.json({
			analyticsData,        // Dữ liệu phân tích tổng thể
			dailySalesData,       // Dữ liệu doanh thu hàng ngày trong tuần trước
		});
	} catch (error) {
		// Nếu có lỗi trong quá trình xử lý
		console.log("Error in analytics route", error.message);  // In lỗi ra console
		// Trả về lỗi với mã trạng thái 500 (Lỗi máy chủ)
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;  // Xuất router để sử dụng trong các file khác
