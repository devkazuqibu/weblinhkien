import mongoose from "mongoose";      // Import mongoose để làm việc với MongoDB
import bcrypt from "bcryptjs";        // Import bcryptjs để mã hóa mật khẩu

// Định nghĩa schema cho User (Người dùng)
const userSchema = new mongoose.Schema(
	{
		// Tên người dùng
		name: {
			type: String,                   // Kiểu dữ liệu là chuỗi
			required: [true, "Name is required"], // Trường này là bắt buộc và có thông báo lỗi tùy chỉnh
		},
		// Email người dùng
		email: {
			type: String,                   // Kiểu dữ liệu là chuỗi
			required: [true, "Email is required"], // Trường này là bắt buộc
			unique: true,                   // Email phải là duy nhất
			lowercase: true,                // Chuyển email về chữ thường trước khi lưu
			trim: true,                     // Xóa bỏ khoảng trắng thừa ở đầu và cuối chuỗi
		},
		// Mật khẩu người dùng
		password: {
			type: String,                   // Kiểu dữ liệu là chuỗi
			required: [true, "Password is required"], // Trường này là bắt buộc
			minlength: [6, "Password must be at least 6 characters long"], // Mật khẩu phải có ít nhất 6 ký tự
		},
		// Danh sách sản phẩm trong giỏ hàng
		cartItems: [
			{
				// Số lượng sản phẩm trong giỏ
				quantity: {
					type: Number,               // Kiểu dữ liệu là số
					default: 1,                  // Mặc định là 1 nếu không có giá trị
				},
				// Sản phẩm trong giỏ hàng
				product: {
					type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu là ObjectId của Product
					ref: "Product",                       // Tham chiếu tới model Product
				},
			},
		],
		// Vai trò của người dùng: khách hàng hoặc admin
		role: {
			type: String,                   // Kiểu dữ liệu là chuỗi
			enum: ["customer", "admin"],    // Giá trị có thể là 'customer' hoặc 'admin'
			default: "customer",            // Mặc định là 'customer'
		},
	},
	{
		timestamps: true,                 // Tạo tự động trường createdAt và updatedAt
	}
);

// Pre-save hook để mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre("save", async function (next) {
	// Nếu mật khẩu không bị thay đổi, không cần mã hóa lại
	if (!this.isModified("password")) return next();

	try {
		// Tạo một salt để mã hóa mật khẩu
		const salt = await bcrypt.genSalt(10);
		// Mã hóa mật khẩu với salt vừa tạo
		this.password = await bcrypt.hash(this.password, salt);
		// Tiếp tục lưu người dùng sau khi mã hóa mật khẩu
		next();
	} catch (error) {
		// Nếu có lỗi trong quá trình mã hóa, chuyển lỗi đến middleware kế tiếp
		next(error);
	}
});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = async function (password) {
	// So sánh mật khẩu đầu vào với mật khẩu đã mã hóa trong cơ sở dữ liệu
	return bcrypt.compare(password, this.password);
};

// Tạo model User từ schema vừa định nghĩa
const User = mongoose.model("User", userSchema);

// Xuất model User để sử dụng ở các file khác
export default User;
