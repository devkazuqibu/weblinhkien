import { Minus, Plus, Trash } from "lucide-react";  // Import các icon từ thư viện lucide-react
import { useCartStore } from "../stores/useCartStore";  // Import hook để quản lý trạng thái giỏ hàng (store)

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();  // Lấy các hàm từ store để xử lý giỏ hàng

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
			{/* Sắp xếp các phần tử trong giỏ hàng */}
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				{/* Hiển thị hình ảnh sản phẩm */}
				<div className='shrink-0 md:order-1'>
					<img className='h-20 md:h-32 rounded object-cover' src={item.image} />
				</div>

				<label className='sr-only'>Choose quantity:</label>

				{/* Hiển thị số lượng sản phẩm và các nút thay đổi số lượng */}
				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						{/* Nút giảm số lượng sản phẩm */}
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							  focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity - 1)}  // Giảm số lượng khi nhấn
						>
							<Minus className='text-gray-300' />  {/* Icon giảm */}
						</button>
						<p>{item.quantity}</p>  {/* Hiển thị số lượng sản phẩm */}
						{/* Nút tăng số lượng sản phẩm */}
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none 
						focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity + 1)}  // Tăng số lượng khi nhấn
						>
							<Plus className='text-gray-300' />  {/* Icon tăng */}
						</button>
					</div>

					{/* Hiển thị giá tiền sản phẩm */}
					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-emerald-400'>${item.price}</p>
					</div>
				</div>

				{/* Hiển thị thông tin chi tiết sản phẩm */}
				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-base font-medium text-white hover:text-emerald-400 hover:underline'>
						{item.name}  {/* Tên sản phẩm */}
					</p>
					<p className='text-sm text-gray-400'>{item.description}</p>  {/* Mô tả sản phẩm */}

					{/* Nút xóa sản phẩm khỏi giỏ hàng */}
					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline'
							onClick={() => removeFromCart(item._id)}  // Xóa sản phẩm khi nhấn
						>
							<Trash />  {/* Icon thùng rác */}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
