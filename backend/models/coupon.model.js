import mongoose from "mongoose";

// Định nghĩa schema cho Coupon (Mã giảm giá)
const couponSchema = new mongoose.Schema(
	{
		// Mã giảm giá (độc nhất)
		code: {
			type: String,             // Kiểu dữ liệu là chuỗi
			required: true,           // Trường này là bắt buộc
			unique: true,             // Mã giảm giá là duy nhất
		},
		// Phần trăm giảm giá (từ 0 đến 100)
		discountPercentage: {
			type: Number,             // Kiểu dữ liệu là số
			required: true,           // Trường này là bắt buộc
			min: 0,                   // Giá trị tối thiểu là 0
			max: 100,                 // Giá trị tối đa là 100
		},
		// Ngày hết hạn của mã giảm giá
		expirationDate: {
			type: Date,               // Kiểu dữ liệu là ngày tháng
			required: true,           // Trường này là bắt buộc
		},
		// Trạng thái của mã giảm giá, mặc định là "active"
		isActive: {
			type: Boolean,            // Kiểu dữ liệu là boolean (true/false)
			default: true,            // Mặc định là true (đang hoạt động)
		},
		// ID người dùng liên kết với mã giảm giá
		userId: {
			type: mongoose.Schema.Types.ObjectId,   // Kiểu dữ liệu là ObjectId từ mongoose
			ref: "User",                             // Liên kết với collection "User"
			required: true,                          // Trường này là bắt buộc
			unique: true,                            // Mỗi người dùng chỉ có một mã giảm giá duy nhất
		},
	},
	{
		// Thêm thời gian tạo và cập nhật tự động vào các document
		timestamps: true,
	}
);

// Tạo model Coupon từ schema vừa định nghĩa
const Coupon = mongoose.model("Coupon", couponSchema);

// Xuất model Coupon để sử dụng ở các file khác
export default Coupon;
