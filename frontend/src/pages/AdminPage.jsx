import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react"; // Import các icon từ thư viện lucide-react
import { useEffect, useState } from "react"; // Import các hook từ React
import { motion } from "framer-motion"; // Import thư viện framer-motion để sử dụng hiệu ứng chuyển động

import AnalyticsTab from "../components/AnalyticsTab"; // Import component AnalyticsTab
import CreateProductForm from "../components/CreateProductForm"; // Import component CreateProductForm
import ProductsList from "../components/ProductsList"; // Import component ProductsList
import { useProductStore } from "../stores/useProductStore"; // Import custom hook useProductStore để quản lý dữ liệu sản phẩm

// Danh sách các tab trong trang Admin với các thuộc tính: id, label, icon
const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle }, // Tab tạo sản phẩm mới
	{ id: "products", label: "Products", icon: ShoppingBasket }, // Tab danh sách sản phẩm
	{ id: "analytics", label: "Analytics", icon: BarChart }, // Tab thống kê
];

const AdminPage = () => {
	// State quản lý tab đang được chọn, mặc định là "create"
	const [activeTab, setActiveTab] = useState("create");
	// Lấy hàm fetchAllProducts từ custom hook useProductStore để fetch danh sách sản phẩm
	const { fetchAllProducts } = useProductStore();

	// Sử dụng useEffect để gọi hàm fetchAllProducts khi component được render lần đầu tiên
	useEffect(() => {
		fetchAllProducts(); // Gọi hàm fetchAllProducts để tải danh sách sản phẩm
	}, [fetchAllProducts]); // Đảm bảo chỉ gọi lại khi fetchAllProducts thay đổi

	return (
		<div className='min-h-screen relative overflow-hidden'>
			{/* Container chính của trang */}
			<div className='relative z-10 container mx-auto px-4 py-16'>
				{/* Tiêu đề trang Admin */}
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }} // Khởi tạo hiệu ứng opacity và vị trí y
					animate={{ opacity: 1, y: 0 }} // Hiệu ứng hoạt hình khi component render
					transition={{ duration: 0.8 }} // Thời gian hiệu ứng là 0.8 giây
				>
					Admin Dashboard
				</motion.h1>

				{/* Các tab để chuyển đổi giữa các phần trong trang Admin */}
				<div className='flex justify-center mb-8'>
					{/* Duyệt qua các tab và render button cho mỗi tab */}
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)} // Cập nhật tab hiện tại khi người dùng nhấn vào tab
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white" // Tab đang chọn sẽ có màu nền xanh
									: "bg-gray-700 text-gray-300 hover:bg-gray-600" // Tab không chọn có màu xám, khi hover có hiệu ứng đổi màu
							}`}
						>
							{/* Render icon của tab */}
							<tab.icon className='mr-2 h-5 w-5' />
							{/* Render label của tab */}
							{tab.label}
						</button>
					))}
				</div>

				{/* Render nội dung của tab dựa trên giá trị activeTab */}
				{activeTab === "create" && <CreateProductForm />} {/* Nếu tab hiện tại là "create", render form tạo sản phẩm */}
				{activeTab === "products" && <ProductsList />} {/* Nếu tab hiện tại là "products", render danh sách sản phẩm */}
				{activeTab === "analytics" && <AnalyticsTab />} {/* Nếu tab hiện tại là "analytics", render phần thống kê */}
			</div>
		</div>
	);
};

export default AdminPage;
