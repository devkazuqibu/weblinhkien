import { XCircle, ArrowLeft } from "lucide-react"; // Các icon từ thư viện lucide-react
import { motion } from "framer-motion"; // Thư viện framer-motion để tạo hiệu ứng chuyển động
import { Link } from "react-router-dom"; // Để tạo liên kết trang chuyển hướng

const PurchaseCancelPage = () => {
	return (
		<div className='min-h-screen flex items-center justify-center px-4'>
			{/* Motion component để thêm hiệu ứng khi hiển thị div */}
			<motion.div
				initial={{ opacity: 0, y: 20 }} // Ban đầu sẽ có độ mờ (opacity) là 0 và dịch chuyển 20px theo trục y
				animate={{ opacity: 1, y: 0 }} // Sau khi chuyển động, opacity sẽ là 1 và dịch chuyển về vị trí ban đầu
				transition={{ duration: 0.5 }} // Thời gian hiệu ứng chuyển động là 0.5 giây
				className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'
			>
				{/* Nội dung trang thông báo hủy đơn hàng */}
				<div className='p-6 sm:p-8'>
					{/* Icon XCircle hiển thị với màu đỏ biểu thị lỗi */}
					<div className='flex justify-center'>
						<XCircle className='text-red-500 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2'>Purchase Cancelled</h1>
					<p className='text-gray-300 text-center mb-6'>
						Your order has been cancelled. No charges have been made.
					</p>
					{/* Thông báo hỗ trợ khách hàng trong trường hợp gặp sự cố */}
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<p className='text-sm text-gray-400 text-center'>
							If you encountered any issues during the checkout process, please don&apos;t hesitate to
							contact our support team.
						</p>
					</div>
					{/* Nút quay lại trang chủ */}
					<div className='space-y-4'>
						<Link
							to={"/"} // Liên kết trở về trang chủ
							className='w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
						>
							{/* Icon quay lại */}
							<ArrowLeft className='mr-2' size={18} />
							Return to Shop
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
