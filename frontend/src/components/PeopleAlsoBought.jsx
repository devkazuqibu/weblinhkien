// Import các thư viện và component cần thiết
import { useEffect, useState } from "react"; // useEffect để xử lý vòng đời, useState để quản lý trạng thái
import ProductCard from "./ProductCard"; // Component hiển thị thông tin sản phẩm
import axios from "../lib/axios"; // Thư viện Axios để gọi API
import toast from "react-hot-toast"; // Thư viện thông báo
import LoadingSpinner from "./LoadingSpinner"; // Component hiển thị vòng xoay tải

const PeopleAlsoBought = () => {
	// Khai báo trạng thái cho danh sách gợi ý và trạng thái tải
	const [recommendations, setRecommendations] = useState([]); // Danh sách sản phẩm gợi ý
	const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải dữ liệu

	// Sử dụng useEffect để gọi API khi component được mount
	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				// Gọi API lấy danh sách sản phẩm gợi ý
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data); // Cập nhật danh sách sản phẩm vào trạng thái
			} catch (error) {
				// Hiển thị thông báo lỗi nếu gọi API thất bại
				toast.error(
					error.response?.data?.message || "An error occurred while fetching recommendations"
				);
			} finally {
				// Dù thành công hay thất bại, dừng trạng thái tải
				setIsLoading(false);
			}
		};

		fetchRecommendations(); // Gọi hàm fetchRecommendations
	}, []); // Mảng phụ thuộc trống nghĩa là chỉ thực hiện khi component được mount

	// Nếu đang tải, hiển thị spinner
	if (isLoading) return <LoadingSpinner />;

	// Trả về giao diện danh sách sản phẩm
	return (
		<div className='mt-8'>
			{/* Tiêu đề */}
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>

			{/* Danh sách sản phẩm hiển thị theo lưới */}
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{recommendations.map((product) => (
					<ProductCard key={product._id} product={product} /> // Hiển thị từng sản phẩm bằng component ProductCard
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought; // Xuất component để sử dụng trong các phần khác của ứng dụng
