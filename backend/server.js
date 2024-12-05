import express from "express";  // Import thư viện express để tạo và quản lý ứng dụng web
import dotenv from "dotenv";  // Import dotenv để đọc các biến môi trường từ file .env
import cookieParser from "cookie-parser";  // Import middleware để phân tích các cookie trong yêu cầu
import path from "path";  // Import thư viện path để làm việc với các đường dẫn file hệ thống

// Import các route cho các chức năng của ứng dụng
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

// Import kết nối cơ sở dữ liệu MongoDB
import { connectDB } from "./lib/db.js";

// Đọc các biến môi trường từ file .env
dotenv.config();

const app = express();  // Khởi tạo một instance của ứng dụng Express
const PORT = process.env.PORT || 5001;  // Lấy cổng từ biến môi trường hoặc mặc định là 5001

const __dirname = path.resolve();  // Lấy đường dẫn tuyệt đối đến thư mục hiện tại

// Middleware cho phép phân tích body của yêu cầu (cấu hình giới hạn kích thước là 10mb)
app.use(express.json({ limit: "10mb" }));

// Middleware để phân tích cookie trong yêu cầu
app.use(cookieParser());

// Định nghĩa các route cho các API
app.use("/api/auth", authRoutes);  // Route cho các chức năng liên quan đến xác thực người dùng
app.use("/api/products", productRoutes);  // Route cho các chức năng liên quan đến sản phẩm
app.use("/api/cart", cartRoutes);  // Route cho các chức năng liên quan đến giỏ hàng
app.use("/api/coupons", couponRoutes);  // Route cho các chức năng liên quan đến mã giảm giá
app.use("/api/payments", paymentRoutes);  // Route cho các chức năng liên quan đến thanh toán
app.use("/api/analytics", analyticsRoutes);  // Route cho các chức năng liên quan đến phân tích dữ liệu

// Nếu môi trường là production, phục vụ các tệp tĩnh từ thư mục frontend
if (process.env.NODE_ENV === "production") {
	// Dùng express để phục vụ các tệp tĩnh từ thư mục 'frontend/dist'
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// Route này sẽ gửi file index.html cho mọi yêu cầu không phải là API
	// Giúp hỗ trợ việc render ứng dụng phía client
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Lắng nghe ứng dụng trên cổng đã chỉ định và kết nối cơ sở dữ liệu
app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();  // Kết nối tới cơ sở dữ liệu MongoDB
});
