import { useState } from "react"; // Nhập useState để quản lý trạng thái của các input trong form
import { motion } from "framer-motion"; // Nhập motion từ framer-motion để tạo hiệu ứng chuyển động
import { PlusCircle, Upload, Loader } from "lucide-react"; // Nhập các icon từ lucide-react để sử dụng trong giao diện
import { useProductStore } from "../stores/useProductStore"; // Nhập hook useProductStore để thao tác với store sản phẩm

// Khai báo danh sách các danh mục có sẵn
const categories = ["cpu", "Manhinh", "Nguon", "Ocung", "Ram", "Tannhiet", "CdDoHoa"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({ // Khởi tạo trạng thái cho sản phẩm mới
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	const { createProduct, loading } = useProductStore(); // Lấy các hàm tạo sản phẩm và trạng thái loading từ store

	// Hàm xử lý khi người dùng submit form
	const handleSubmit = async (e) => {
		e.preventDefault(); // Ngừng hành động mặc định của form (submit)
		try {
			await createProduct(newProduct); // Gọi hàm createProduct từ store để tạo sản phẩm mới
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" }); // Reset form sau khi tạo sản phẩm thành công
		} catch {
			console.log("error creating a product"); // Xử lý lỗi nếu có
		}
	};

	// Hàm xử lý thay đổi hình ảnh sản phẩm
	const handleImageChange = (e) => {
		const file = e.target.files[0]; // Lấy file hình ảnh từ input
		if (file) {
			const reader = new FileReader(); // Tạo một FileReader để đọc file hình ảnh

			// Đọc file dưới dạng base64 khi hoàn tất
			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result }); // Lưu hình ảnh vào trạng thái sản phẩm mới
			};

			reader.readAsDataURL(file); // Đọc file dưới dạng base64
		}
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2> {/* Tiêu đề form */}

			<form onSubmit={handleSubmit} className='space-y-4'> {/* Form để nhập thông tin sản phẩm */}
				{/* Tên sản phẩm */}
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				{/* Mô tả sản phẩm */}
				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				{/* Giá sản phẩm */}
				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				{/* Chọn danh mục sản phẩm */}
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option> {/* Lựa chọn danh mục */}
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				{/* Tải hình ảnh cho sản phẩm */}
				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>} {/* Hiển thị thông báo nếu đã tải ảnh */}
				</div>

				{/* Nút tạo sản phẩm */}
				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading} // Disable nút khi đang trong trạng thái loading
				>
					{loading ? ( // Hiển thị Loader nếu đang tải
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;
