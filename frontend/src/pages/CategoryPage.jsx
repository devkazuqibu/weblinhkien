import { useEffect } from "react"; // Import useEffect để thực hiện các tác vụ khi component được render
import { useProductStore } from "../stores/useProductStore"; // Import custom hook useProductStore để lấy dữ liệu sản phẩm
import { useParams } from "react-router-dom"; // Import useParams để lấy tham số từ URL
import { motion } from "framer-motion"; // Import framer-motion để sử dụng hiệu ứng hoạt hình
import ProductCard from "../components/ProductCard"; // Import component ProductCard để hiển thị từng sản phẩm

// CategoryPage component - Trang sản phẩm theo danh mục
const CategoryPage = () => {
	// Lấy dữ liệu sản phẩm và hàm fetchProductsByCategory từ custom hook useProductStore
	const { fetchProductsByCategory, products } = useProductStore();

	// Lấy tham số category từ URL (tên danh mục)
	const { category } = useParams();

	// Dùng useEffect để gọi fetchProductsByCategory khi category thay đổi
	useEffect(() => {
		fetchProductsByCategory(category); // Gọi API hoặc phương thức để lấy sản phẩm theo danh mục
	}, [fetchProductsByCategory, category]); // Chạy lại khi fetchProductsByCategory hoặc category thay đổi

	// Log dữ liệu sản phẩm để kiểm tra
	console.log("products:", products);

	return (
		<div className='min-h-screen'>
			{/* Container chính của trang */}
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{/* Tiêu đề trang, tên danh mục */}
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }} // Khởi tạo hiệu ứng opacity và di chuyển từ trên xuống
					animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi phần tử xuất hiện
					transition={{ duration: 0.8 }} // Thời gian hiệu ứng là 0.8 giây
				>
					{/* Hiển thị tên danh mục với chữ cái đầu tiên viết hoa */}
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				{/* Grid hiển thị sản phẩm */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }} // Khởi tạo hiệu ứng opacity và di chuyển từ trên xuống
					animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi phần tử xuất hiện
					transition={{ duration: 0.8, delay: 0.2 }} // Thời gian hiệu ứng và delay là 0.2 giây
				>
					{/* Nếu không có sản phẩm, hiển thị thông báo "No products found" */}
					{products?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{/* Duyệt qua danh sách sản phẩm và render mỗi sản phẩm bằng ProductCard */}
					{products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};
export default CategoryPage;
