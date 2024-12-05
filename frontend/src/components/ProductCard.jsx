// Import các thư viện và hooks cần thiết
import toast from "react-hot-toast"; // Thư viện hiển thị thông báo
import { ShoppingCart } from "lucide-react"; // Icon giỏ hàng
import { useUserStore } from "../stores/useUserStore"; // Quản lý trạng thái người dùng
import { useCartStore } from "../stores/useCartStore"; // Quản lý trạng thái giỏ hàng

// Component ProductCard nhận tham số đầu vào là đối tượng sản phẩm
const ProductCard = ({ product }) => {
	// Lấy trạng thái người dùng từ store
	const { user } = useUserStore();

	// Lấy hàm thêm sản phẩm vào giỏ hàng từ store giỏ hàng
	const { addToCart } = useCartStore();

	// Hàm xử lý khi nhấn nút "Add to cart"
	const handleAddToCart = () => {
		// Nếu người dùng chưa đăng nhập, hiển thị thông báo lỗi
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// Nếu đã đăng nhập, thêm sản phẩm vào giỏ hàng
			addToCart(product);
		}
	};

	// Trả về giao diện hiển thị sản phẩm
	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			{/* Phần hiển thị hình ảnh sản phẩm */}
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img
					className='object-cover w-full' // Hình ảnh được căn chỉnh và chiếm toàn bộ chiều rộng
					src={product.image} // Đường dẫn ảnh sản phẩm
					alt='product image' // Thẻ ALT để hỗ trợ SEO và truy cập
				/>
				<div className='absolute inset-0 bg-black bg-opacity-20' /> {/* Hiệu ứng phủ mờ */}
			</div>

			{/* Phần thông tin sản phẩm */}
			<div className='mt-4 px-5 pb-5'>
				{/* Tên sản phẩm */}
				<h5 className='text-xl font-semibold tracking-tight text-white'>
					{product.name}
				</h5>

				{/* Giá sản phẩm */}
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>
							${product.price}
						</span>
					</p>
				</div>

				{/* Nút thêm vào giỏ hàng */}
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToCart} // Gọi hàm xử lý khi nhấn nút
				>
					<ShoppingCart size={22} className='mr-2' /> {/* Icon giỏ hàng */}
					Add to cart {/* Nội dung nút */}
				</button>
			</div>
		</div>
	);
};

export default ProductCard; // Xuất component để sử dụng trong các phần khác của ứng dụng
