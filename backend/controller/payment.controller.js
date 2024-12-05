import Coupon from "../models/coupon.model.js"; // Import model Coupon
import Order from "../models/order.model.js"; // Import model Order
import { stripe } from "../lib/stripe.js"; // Import thư viện Stripe để xử lý thanh toán

// Hàm tạo một phiên thanh toán (checkout session) trên Stripe
export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body; // Lấy thông tin sản phẩm và mã giảm giá từ request body

		// Kiểm tra danh sách sản phẩm hợp lệ
		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0; // Tổng số tiền thanh toán

		// Xây dựng danh sách các sản phẩm theo định dạng yêu cầu của Stripe
		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Stripe yêu cầu giá ở đơn vị cents
			totalAmount += amount * product.quantity; // Tính tổng số tiền

			return {
				price_data: {
					currency: "usd", // Đơn vị tiền tệ
					product_data: {
						name: product.name, // Tên sản phẩm
						images: [product.image], // Hình ảnh sản phẩm
					},
					unit_amount: amount, // Giá sản phẩm
				},
				quantity: product.quantity || 1, // Số lượng sản phẩm
			};
		});

		// Xử lý mã giảm giá nếu có
		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true }); // Tìm mã giảm giá hợp lệ
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100); // Áp dụng giảm giá
			}
		}

		// Tạo một phiên thanh toán trên Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"], // Các phương thức thanh toán hỗ trợ
			line_items: lineItems, // Danh sách sản phẩm
			mode: "payment", // Chế độ thanh toán
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`, // URL khi thanh toán thành công
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`, // URL khi thanh toán bị hủy
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage), // Tạo mã giảm giá trên Stripe
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(), // ID người dùng
				couponCode: couponCode || "", // Mã giảm giá (nếu có)
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				), // Lưu trữ thông tin sản phẩm trong metadata
			},
		});

		// Tạo mã giảm giá mới nếu tổng tiền >= 20,000 USD
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 }); // Trả về ID của session và tổng tiền
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message }); // Trả về lỗi nếu có
	}
};

// Hàm xử lý khi thanh toán thành công
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body; // Lấy sessionId từ request body
		const session = await stripe.checkout.sessions.retrieve(sessionId); // Lấy thông tin session từ Stripe

		if (session.payment_status === "paid") {
			// Nếu có sử dụng mã giảm giá, hủy kích hoạt mã
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// Tạo đơn hàng mới
			const products = JSON.parse(session.metadata.products); // Lấy thông tin sản phẩm từ metadata
			const newOrder = new Order({
				user: session.metadata.userId, // ID người dùng
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})), // Danh sách sản phẩm
				totalAmount: session.amount_total / 100, // Tổng tiền (đổi từ cents sang USD)
				stripeSessionId: sessionId, // ID session Stripe
			});

			await newOrder.save(); // Lưu đơn hàng vào cơ sở dữ liệu

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id, // Trả về ID đơn hàng
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message }); // Trả về lỗi nếu có
	}
};

// Hàm tạo mã giảm giá trên Stripe
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage, // Phần trăm giảm giá
		duration: "once", // Chỉ áp dụng một lần
	});

	return coupon.id; // Trả về ID của mã giảm giá
}

// Hàm tạo mã giảm giá mới cho người dùng
async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId }); // Xóa mã giảm giá cũ nếu tồn tại

	// Tạo mã giảm giá mới
	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // Tạo mã ngẫu nhiên
		discountPercentage: 10, // Giảm giá 10%
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
		userId: userId, // Gắn với người dùng
	});

	await newCoupon.save(); // Lưu vào cơ sở dữ liệu

	return newCoupon; // Trả về mã giảm giá mới
}
