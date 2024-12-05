import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware để bảo vệ các route, yêu cầu người dùng đã đăng nhập và có token hợp lệ
export const protectRoute = async (req, res, next) => {
	try {
		// Lấy accessToken từ cookie của request
		const accessToken = req.cookies.accessToken;

		// Nếu không có token, trả về lỗi 401 Unauthorized
		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		// Xác thực token bằng cách sử dụng secret key
		try {
			// Giải mã token và lấy thông tin userId từ token
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

			// Truy vấn thông tin người dùng từ cơ sở dữ liệu theo userId từ token
			const user = await User.findById(decoded.userId).select("-password"); // không trả về mật khẩu

			// Nếu không tìm thấy người dùng, trả về lỗi 401 Unauthorized
			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			// Gán thông tin người dùng vào `req.user` để sử dụng trong các route tiếp theo
			req.user = user;

			// Tiếp tục thực hiện các middleware/route tiếp theo
			next();
		} catch (error) {
			// Nếu token hết hạn, trả về lỗi 401 Unauthorized
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			// Nếu có lỗi khác, ném lỗi ra ngoài
			throw error;
		}
	} catch (error) {
		// Lỗi trong quá trình xử lý, trả về lỗi 401 Unauthorized với thông báo lỗi cụ thể
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

// Middleware để bảo vệ các route chỉ cho phép admin truy cập
export const adminRoute = (req, res, next) => {
	// Kiểm tra xem người dùng có tồn tại và có vai trò là 'admin' không
	if (req.user && req.user.role === "admin") {
		// Nếu có, tiếp tục thực hiện các middleware/route tiếp theo
		next();
	} else {
		// Nếu không phải admin, trả về lỗi 403 Forbidden
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
