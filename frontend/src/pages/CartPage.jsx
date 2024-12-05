import { Link } from "react-router-dom"; // Import Link để chuyển hướng đến các trang khác
import { useCartStore } from "../stores/useCartStore"; // Import custom hook useCartStore để lấy dữ liệu giỏ hàng
import { motion } from "framer-motion"; // Import thư viện framer-motion để sử dụng hiệu ứng hoạt hình
import { ShoppingCart } from "lucide-react"; // Import biểu tượng giỏ hàng từ lucide-react
import CartItem from "../components/CartItem"; // Import component CartItem để hiển thị mỗi sản phẩm trong giỏ hàng
import PeopleAlsoBought from "../components/PeopleAlsoBought"; // Import component để hiển thị sản phẩm liên quan (sản phẩm người khác cũng mua)
import OrderSummary from "../components/OrderSummary"; // Import component tóm tắt đơn hàng
import GiftCouponCard from "../components/GiftCouponCard"; // Import component thẻ quà tặng (coupon)

// CartPage component, trang giỏ hàng
const CartPage = () => {
	// Lấy dữ liệu giỏ hàng từ custom hook useCartStore
	const { cart } = useCartStore();

	return (
		<div className='py-8 md:py-16'>
			{/* Container chính của trang */}
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
					{/* Phần hiển thị giỏ hàng hoặc thông báo giỏ hàng trống */}
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }} // Khởi tạo hiệu ứng opacity và di chuyển từ trái qua
						animate={{ opacity: 1, x: 0 }} // Hiệu ứng hoạt hình khi element xuất hiện
						transition={{ duration: 0.5, delay: 0.2 }} // Thời gian hiệu ứng là 0.5 giây và delay 0.2 giây
					>
						{/* Kiểm tra xem giỏ hàng có rỗng hay không */}
						{cart.length === 0 ? (
							<EmptyCartUI /> // Nếu giỏ hàng trống, render EmptyCartUI
						) : (
							<div className='space-y-6'>
								{/* Duyệt qua các item trong giỏ hàng và render CartItem */}
								{cart.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}
						{/* Hiển thị phần "People Also Bought" nếu giỏ hàng không trống */}
						{cart.length > 0 && <PeopleAlsoBought />}
					</motion.div>

					{/* Hiển thị phần tóm tắt đơn hàng và thẻ quà tặng nếu giỏ hàng không trống */}
					{cart.length > 0 && (
						<motion.div
							className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
							initial={{ opacity: 0, x: 20 }} // Khởi tạo hiệu ứng opacity và di chuyển từ phải qua
							animate={{ opacity: 1, x: 0 }} // Hiệu ứng hoạt hình khi element xuất hiện
							transition={{ duration: 0.5, delay: 0.4 }} // Thời gian hiệu ứng là 0.5 giây và delay 0.4 giây
						>
							{/* Render OrderSummary để hiển thị tóm tắt đơn hàng */}
							<OrderSummary />
							{/* Render GiftCouponCard để hiển thị thẻ quà tặng */}
							<GiftCouponCard />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};
export default CartPage;

// Component hiển thị khi giỏ hàng trống
const EmptyCartUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-4 py-16'
		initial={{ opacity: 0, y: 20 }} // Khởi tạo hiệu ứng opacity và di chuyển từ dưới lên
		animate={{ opacity: 1, y: 0 }} // Hiệu ứng hoạt hình khi element xuất hiện
		transition={{ duration: 0.5 }} // Thời gian hiệu ứng là 0.5 giây
	>
		{/* Biểu tượng giỏ hàng */}
		<ShoppingCart className='h-24 w-24 text-gray-300' />
		{/* Tiêu đề thông báo giỏ hàng trống */}
		<h3 className='text-2xl font-semibold '>Your cart is empty</h3>
		{/* Mô tả thông báo giỏ hàng trống */}
		<p className='text-gray-400'>Looks like you {"haven't"} added anything to your cart yet.</p>
		{/* Liên kết tới trang chủ để bắt đầu mua sắm */}
		<Link
			className='mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600'
			to='/'
		>
			Start Shopping
		</Link>
	</motion.div>
);
