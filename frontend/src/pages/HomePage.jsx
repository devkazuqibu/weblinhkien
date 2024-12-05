import CategoryItem from "../components/CategoryItem"; // Import component CategoryItem để hiển thị mỗi danh mục

// Danh sách các danh mục sản phẩm
const categories = [
	{ href: "/cpu", name: "CPU", imageUrl: "/CPU.png" }, // Danh mục CPU
	{ href: "/Manhinh", name: "Màn hình", imageUrl: "/manhinhPC.jpeg" }, // Danh mục Màn hình
	{ href: "/Nguon", name: "Nguồn", imageUrl: "/NguonPC.webp" }, // Danh mục Nguồn
	{ href: "/Ocung", name: "Ổ Cứng", imageUrl: "/Ocung.webp" }, // Danh mục Ổ Cứng
	{ href: "/Ram", name: "Ram", imageUrl: "/Ram.webp" }, // Danh mục Ram
	{ href: "/Tannhiet", name: "Tản Nhiệt", imageUrl: "/TanNhietPC.webp" }, // Danh mục Tản Nhiệt
	{ href: "/CdDohoa", name: "Card Đồ Họa", imageUrl: "/Carddohoa.webp" }, // Danh mục Card Đồ Họa
];

const HomePage = () => {
	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			{/* Container chính của trang */}
			<div className='relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{/* Tiêu đề trang, hiển thị text siêu sale tháng 12 */}
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Siêu sale tháng 12
				</h1>

				{/* Mô tả cho chương trình sale */}
				<p className='text-center text-xl text-gray-300 mb-12'>
					Đại tiệc cuối năm săn sale xã láng
				</p>

				{/* Grid hiển thị các danh mục sản phẩm */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{/* Duyệt qua danh sách categories và render mỗi danh mục bằng CategoryItem */}
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
			</div>
		</div>
	);
};
export default HomePage;
