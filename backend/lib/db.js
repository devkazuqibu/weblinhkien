import mongoose from "mongoose"; // Import thư viện Mongoose để làm việc với MongoDB

// Hàm kết nối tới cơ sở dữ liệu MongoDB
export const connectDB = async () => {
	try {
		// Kết nối tới MongoDB bằng URI lấy từ biến môi trường
		const conn = await mongoose.connect(process.env.MONGO_URI);

		// In ra thông báo thành công và địa chỉ host của kết nối
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		// Nếu có lỗi xảy ra, in lỗi ra console
		console.log("Error connecting to MONGODB", error.message);

		// Thoát ứng dụng với mã lỗi 1
		process.exit(1);
	}
};
