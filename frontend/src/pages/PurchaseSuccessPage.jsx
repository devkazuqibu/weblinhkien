import { ArrowRight, CheckCircle, HandHeart } from "lucide-react"; // Các icon từ thư viện lucide-react
import { useEffect, useState } from "react"; // Hook từ React để quản lý trạng thái
import { Link } from "react-router-dom"; // Để tạo các liên kết điều hướng giữa các trang
import { useCartStore } from "../stores/useCartStore"; // Lấy dữ liệu từ store cart
import axios from "../lib/axios"; // Dùng axios để gửi yêu cầu HTTP
import Confetti from "react-confetti"; // Hiệu ứng confetti ăn mừng

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true); // Trạng thái xử lý của thanh toán
	const { clearCart } = useCartStore(); // Lấy hàm clearCart từ store cart để xóa giỏ hàng sau khi mua thành công
	const [error, setError] = useState(null); // Trạng thái lỗi nếu có vấn đề trong quá trình xử lý

	// useEffect sẽ chạy khi component được tải lần đầu để xử lý sự kiện thanh toán thành công
	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				// Gửi thông tin thanh toán lên server
				await axios.post("/payments/checkout-success", {
					sessionId,
				});
				clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công
			} catch (error) {
				console.log(error); // Log lỗi nếu có
			} finally {
				setIsProcessing(false); // Đặt trạng thái là không còn xử lý nữa
			}
		};

		// Lấy sessionId từ URL query params
		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId); // Gọi hàm xử lý khi có sessionId
		} else {
			setIsProcessing(false); // Nếu không có sessionId, dừng trạng thái đang xử lý
			setError("No session ID found in the URL"); // Thiết lập lỗi nếu không có sessionId
		}
	}, [clearCart]);

	// Nếu trạng thái vẫn đang xử lý, hiển thị thông báo đang xử lý
	if (isProcessing) return "Processing...";

	// Nếu có lỗi xảy ra, hiển thị lỗi
	if (error) return `Error: ${error}`;

	// Trang thành công, hiển thị khi thanh toán hoàn tất
	return (
		<div className='h-screen flex items-center justify-center px-4'>
			{/* Hiệu ứng confetti khi thanh toán thành công */}
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				{/* Nội dung trang thông báo thanh toán thành công */}
				<div className='p-6 sm:p-8'>
					{/* Biểu tượng thành công */}
					<div className='flex justify-center'>
						<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
						Purchase Successful!
					</h1>

					<p className='text-gray-300 text-center mb-2'>
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className='text-emerald-400 text-center text-sm mb-6'>
						Check your email for order details and updates.
					</p>
					
					{/* Thông tin đơn hàng */}
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-emerald-400'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
						</div>
					</div>

					{/* Các nút hành động sau khi thanh toán thành công */}
					<div className='space-y-4'>
						{/* Nút cảm ơn người dùng đã mua hàng */}
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						
						{/* Liên kết quay lại trang chủ */}
						<Link
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;
