import { useEffect, useState } from "react"; // Nhập các hook useEffect và useState để quản lý trạng thái và hiệu ứng
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"; // Nhập các icon từ lucide-react
import { useCartStore } from "../stores/useCartStore"; // Nhập hook useCartStore để thao tác với giỏ hàng

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0); // Trạng thái lưu chỉ mục hiện tại của sản phẩm được hiển thị
	const [itemsPerPage, setItemsPerPage] = useState(4); // Trạng thái lưu số lượng sản phẩm hiển thị mỗi trang

	const { addToCart } = useCartStore(); // Lấy hàm addToCart từ store giỏ hàng để thêm sản phẩm vào giỏ

	// Hook useEffect được sử dụng để thiết lập sự kiện thay đổi kích thước cửa sổ
	useEffect(() => {
		const handleResize = () => {
			// Thay đổi số lượng sản phẩm hiển thị dựa trên kích thước cửa sổ
			if (window.innerWidth < 640) setItemsPerPage(1); // Nếu cửa sổ nhỏ hơn 640px, hiển thị 1 sản phẩm
			else if (window.innerWidth < 1024) setItemsPerPage(2); // Nếu cửa sổ nhỏ hơn 1024px, hiển thị 2 sản phẩm
			else if (window.innerWidth < 1280) setItemsPerPage(3); // Nếu cửa sổ nhỏ hơn 1280px, hiển thị 3 sản phẩm
			else setItemsPerPage(4); // Nếu cửa sổ lớn hơn 1280px, hiển thị 4 sản phẩm
		};

		handleResize(); // Gọi hàm resize để thiết lập số lượng sản phẩm ngay khi component được render lần đầu
		window.addEventListener("resize", handleResize); // Thêm sự kiện resize để lắng nghe thay đổi kích thước cửa sổ
		return () => window.removeEventListener("resize", handleResize); // Cleanup event listener khi component bị unmount
	}, []);

	// Hàm chuyển sang slide tiếp theo
	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage); // Tăng chỉ mục hiện tại khi chuyển sang slide tiếp theo
	};

	// Hàm quay lại slide trước
	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage); // Giảm chỉ mục hiện tại khi quay lại slide trước
	};

	// Kiểm tra xem nút "Previous" có bị vô hiệu hóa không (nếu ở đầu danh sách sản phẩm)
	const isStartDisabled = currentIndex === 0;
	// Kiểm tra xem nút "Next" có bị vô hiệu hóa không (nếu ở cuối danh sách sản phẩm)
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Featured</h2> {/* Tiêu đề sản phẩm nổi bật */}

				<div className='relative'>
					<div className='overflow-hidden'>
						{/* Đoạn này sẽ di chuyển các sản phẩm theo chiều ngang */}
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }} // Cập nhật transform để di chuyển sản phẩm
						>
							{/* Duyệt qua danh sách sản phẩm và hiển thị mỗi sản phẩm */}
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									{/* Hiển thị sản phẩm với ảnh, tên, giá và nút thêm vào giỏ hàng */}
									<div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
										<div className='overflow-hidden'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
											/>
										</div>
										<div className='p-4'>
											<h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
											<p className='text-emerald-300 font-medium mb-4'>
												${product.price.toFixed(2)}
											</p>
											<button
												onClick={() => addToCart(product)} // Thêm sản phẩm vào giỏ hàng khi nhấn nút
												className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' /> {/* Icon giỏ hàng */}
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Nút quay lại */}
					<button
						onClick={prevSlide}
						disabled={isStartDisabled} // Vô hiệu hóa nút nếu đang ở đầu danh sách
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					{/* Nút chuyển sang slide tiếp theo */}
					<button
						onClick={nextSlide}
						disabled={isEndDisabled} // Vô hiệu hóa nút nếu đang ở cuối danh sách
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;
