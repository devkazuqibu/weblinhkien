// Import các thư viện cần thiết
import { motion } from "framer-motion"; // Thư viện hoạt ảnh cho React
import { useCartStore } from "../stores/useCartStore"; // Lấy trạng thái giỏ hàng từ store
import { Link } from "react-router-dom"; // Liên kết điều hướng
import { MoveRight } from "lucide-react"; // Icon mũi tên
import { loadStripe } from "@stripe/stripe-js"; // Tích hợp Stripe để thanh toán
import axios from "../lib/axios"; // Thư viện Axios để gọi API

// Khởi tạo Stripe với khóa public
const stripePromise = loadStripe(
	"pk_test_51QNu72At6u7PcqFEZWag9HBWPxUTHmZHlg1ivdcakjgkmyoSaKSsSIhfsyF7IRyT2TNvRc8nI0bwswFCkjkPXPHw00zs0zPpCG"
);

const OrderSummary = () => {
	// Lấy các thông tin từ store giỏ hàng
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	// Tính toán chi tiết đơn hàng
	const savings = subtotal - total; // Số tiền tiết kiệm được
	const formattedSubtotal = subtotal.toFixed(2); // Định dạng số thập phân cho giá ban đầu
	const formattedTotal = total.toFixed(2); // Định dạng số thập phân cho tổng tiền
	const formattedSavings = savings.toFixed(2); // Định dạng số thập phân cho số tiền tiết kiệm

	// Hàm xử lý thanh toán
	const handlePayment = async () => {
		const stripe = await stripePromise; // Lấy đối tượng Stripe
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart, // Gửi danh sách sản phẩm trong giỏ hàng
			couponCode: coupon ? coupon.code : null, // Gửi mã giảm giá (nếu có)
		});

		const session = res.data; // Nhận thông tin session từ API
		console.log("session is here", session);

		// Chuyển hướng đến trang thanh toán của Stripe
		const result = await stripe.redirectToCheckout({
			sessionId: session.id, // Sử dụng session ID để chuyển hướng
		});

		// Xử lý lỗi nếu có
		if (result.error) {
			console.error("Error:", result.error);
		}
	};

	return (
		// Khung chứa tóm tắt đơn hàng với hiệu ứng hoạt ảnh
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }} // Bắt đầu từ vị trí thấp hơn và mờ
			animate={{ opacity: 1, y: 0 }} // Hiệu ứng chuyển động xuất hiện
			transition={{ duration: 0.5 }} // Thời gian thực hiện hoạt ảnh
		>
			{/* Tiêu đề */}
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			{/* Hiển thị chi tiết đơn hàng */}
			<div className='space-y-4'>
				<div className='space-y-2'>
					{/* Giá gốc */}
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{/* Hiển thị số tiền tiết kiệm (nếu có) */}
					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{/* Hiển thị thông tin mã giảm giá nếu được áp dụng */}
					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}

					{/* Hiển thị tổng tiền phải trả */}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				{/* Nút chuyển đến thanh toán */}
				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }} // Hiệu ứng khi rê chuột
					whileTap={{ scale: 0.95 }} // Hiệu ứng khi nhấn
					onClick={handlePayment} // Gọi hàm xử lý thanh toán
				>
					Proceed to Checkout
				</motion.button>

				{/* Liên kết quay lại trang mua sắm */}
				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} /> {/* Icon mũi tên */}
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary; // Xuất component để sử dụng trong các phần khác của ứng dụng
