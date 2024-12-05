import mongoose from "mongoose";

// Định nghĩa schema cho Order (Đơn hàng)
const orderSchema = new mongoose.Schema(
	{
		// Người dùng tạo đơn hàng này
		user: {
			type: mongoose.Schema.Types.ObjectId,   // Kiểu dữ liệu là ObjectId, liên kết với model "User"
			ref: "User",                             // Liên kết với collection "User"
			required: true,                          // Trường này là bắt buộc
		},
		// Danh sách các sản phẩm trong đơn hàng
		products: [
			{
				// Sản phẩm liên kết với đơn hàng
				product: {
					type: mongoose.Schema.Types.ObjectId,   // Kiểu dữ liệu là ObjectId, liên kết với model "Product"
					ref: "Product",                         // Liên kết với collection "Product"
					required: true,                         // Trường này là bắt buộc
				},
				// Số lượng sản phẩm trong đơn hàng
				quantity: {
					type: Number,                          // Kiểu dữ liệu là số
					required: true,                         // Trường này là bắt buộc
					min: 1,                                 // Số lượng tối thiểu là 1
				},
				// Giá của sản phẩm trong đơn hàng
				price: {
					type: Number,                          // Kiểu dữ liệu là số
					required: true,                         // Trường này là bắt buộc
					min: 0,                                 // Giá tối thiểu là 0
				},
			},
		],
		// Tổng số tiền của đơn hàng (tính bằng đơn vị tiền tệ cơ bản)
		totalAmount: {
			type: Number,                             // Kiểu dữ liệu là số
			required: true,                            // Trường này là bắt buộc
			min: 0,                                    // Giá trị tối thiểu là 0
		},
		// ID của phiên giao dịch Stripe (nếu có sử dụng Stripe)
		stripeSessionId: {
			type: String,                             // Kiểu dữ liệu là chuỗi
			unique: true,                             // Đảm bảo rằng mỗi phiên giao dịch Stripe có một ID duy nhất
		},
	},
	{ timestamps: true } // Thêm trường createdAt và updatedAt tự động
);

// Tạo model Order từ schema vừa định nghĩa
const Order = mongoose.model("Order", orderSchema);

// Xuất model Order để sử dụng ở các file khác
export default Order;
