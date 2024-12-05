import mongoose from "mongoose";

// Định nghĩa schema cho Product (Sản phẩm)
const productSchema = new mongoose.Schema(
	{
		// Tên sản phẩm
		name: {
			type: String,                         // Kiểu dữ liệu là chuỗi
			required: true,                        // Trường này là bắt buộc
		},
		// Mô tả sản phẩm
		description: {
			type: String,                         // Kiểu dữ liệu là chuỗi
			required: true,                        // Trường này là bắt buộc
		},
		// Giá sản phẩm
		price: {
			type: Number,                         // Kiểu dữ liệu là số
			min: 0,                               // Giá trị tối thiểu là 0 (giá không thể âm)
			required: true,                        // Trường này là bắt buộc
		},
		// Đường dẫn hình ảnh của sản phẩm
		image: {
			type: String,                         // Kiểu dữ liệu là chuỗi
			required: [true, "Image is required"], // Trường này là bắt buộc và có thông báo lỗi tùy chỉnh
		},
		// Danh mục của sản phẩm (ví dụ: điện thoại, quần áo, thực phẩm...)
		category: {
			type: String,                         // Kiểu dữ liệu là chuỗi
			required: true,                        // Trường này là bắt buộc
		},
		// Trạng thái sản phẩm có nổi bật hay không
		isFeatured: {
			type: Boolean,                        // Kiểu dữ liệu là Boolean
			default: false,                       // Mặc định là false (không nổi bật)
		},
	},
	{ timestamps: true } // Thêm trường createdAt và updatedAt tự động
);

// Tạo model Product từ schema vừa định nghĩa
const Product = mongoose.model("products", productSchema);

// Xuất model Product để sử dụng ở các file khác
export default Product;
