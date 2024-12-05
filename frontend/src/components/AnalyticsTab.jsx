import { motion } from "framer-motion";  // Import thư viện để thêm hiệu ứng động vào các thành phần
import { useEffect, useState } from "react";  // useState và useEffect là hook của React để quản lý state và các side effects
import axios from "../lib/axios";  // Axios để gửi yêu cầu HTTP
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";  // Icon từ thư viện lucide-react
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";  // Các thành phần từ Recharts để vẽ đồ thị

const AnalyticsTab = () => {
	// Khởi tạo các state để lưu trữ dữ liệu phân tích và kiểm tra trạng thái tải dữ liệu
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);  // Kiểm tra trạng thái đang tải dữ liệu
	const [dailySalesData, setDailySalesData] = useState([]);  // Dữ liệu bán hàng hàng ngày

	useEffect(() => {
		// Hàm tải dữ liệu phân tích từ API
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");  // Gửi yêu cầu GET đến API
				setAnalyticsData(response.data.analyticsData);  // Lưu trữ dữ liệu phân tích
				setDailySalesData(response.data.dailySalesData);  // Lưu trữ dữ liệu bán hàng hàng ngày
			} catch (error) {
				console.error("Error fetching analytics data:", error);  // Xử lý lỗi khi tải dữ liệu
			} finally {
				setIsLoading(false);  // Đặt trạng thái tải dữ liệu thành false sau khi hoàn thành
			}
		};

		fetchAnalyticsData();  // Gọi hàm tải dữ liệu khi component mount
	}, []);  // Chạy effect chỉ một lần khi component mount

	// Nếu đang tải dữ liệu, hiển thị màn hình loading
	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			{/* Hiển thị các card phân tích thông tin tổng quan */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}  // Format giá trị số cho đẹp mắt
					icon={Users}  // Icon người dùng
					color='from-emerald-500 to-teal-700'  // Màu sắc gradient
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}  // Icon sản phẩm
					color='from-emerald-500 to-green-700'  // Màu sắc gradient
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}  // Icon giỏ hàng
					color='from-emerald-500 to-cyan-700'  // Màu sắc gradient
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}  // Định dạng tiền tệ
					icon={DollarSign}  // Icon tiền tệ
					color='from-emerald-500 to-lime-700'  // Màu sắc gradient
				/>
			</div>

			{/* Hiển thị đồ thị doanh thu và bán hàng */}
			<motion.div
				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }}  // Thiết lập hiệu ứng ban đầu cho phần tử
				animate={{ opacity: 1, y: 0 }}  // Hiệu ứng khi phần tử xuất hiện
				transition={{ duration: 0.5, delay: 0.25 }}  // Thiết lập thời gian hiệu ứng
			>
				{/* Đồ thị line chart với dữ liệu bán hàng */}
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' />  {/* Lưới cho đồ thị */}
						<XAxis dataKey='name' stroke='#D1D5DB' />  {/* Trục X */}
						<YAxis yAxisId='left' stroke='#D1D5DB' />  {/* Trục Y trái */}
						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />  {/* Trục Y phải */}
						<Tooltip />  {/* Tooltip khi di chuột vào các điểm trên đồ thị */}
						<Legend />  {/* Hiển thị legend */}
						{/* Đường line cho dữ liệu bán hàng */}
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'  // Dữ liệu bán hàng
							stroke='#10B981'  // Màu của đường line
							activeDot={{ r: 8 }}  // Kích thước dot khi hover
							name='Sales'
						/>
						{/* Đường line cho doanh thu */}
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'  // Dữ liệu doanh thu
							stroke='#3B82F6'  // Màu của đường line
							activeDot={{ r: 8 }}  // Kích thước dot khi hover
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	// Card hiển thị thông tin tổng quan với icon và màu sắc gradient
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}  // Thiết lập lớp CSS với màu sắc gradient
		initial={{ opacity: 0, y: 20 }}  // Thiết lập hiệu ứng ban đầu cho phần tử
		animate={{ opacity: 1, y: 0 }}  // Hiệu ứng khi phần tử xuất hiện
		transition={{ duration: 0.5 }}  // Thiết lập thời gian hiệu ứng
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>  {/* Tiêu đề card */}
				<h3 className='text-white text-3xl font-bold'>{value}</h3>  {/* Giá trị card */}
			</div>
		</div>
		{/* Màu gradient nền */}
		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
		{/* Icon ở góc dưới card */}
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);
