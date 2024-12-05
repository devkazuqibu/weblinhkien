import { create } from "zustand"; // Import thư viện zustand để tạo store quản lý trạng thái toàn cục
import axios from "../lib/axios"; // Import axios để thực hiện các yêu cầu HTTP
import { toast } from "react-hot-toast"; // Import thư viện toast để hiển thị thông báo

// Tạo một store sử dụng zustand để quản lý giỏ hàng
export const useCartStore = create((set, get) => ({
	// Trạng thái giỏ hàng ban đầu
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	// Hàm lấy thông tin mã giảm giá (coupon)
	getMyCoupon: async () => {
		try {
			// Gửi yêu cầu GET để lấy mã giảm giá
			const response = await axios.get("/coupons");
			set({ coupon: response.data }); // Cập nhật coupon vào store
		} catch (error) {
			console.error("Error fetching coupon:", error); // Xử lý lỗi khi lấy mã giảm giá
		}
	},

	// Hàm áp dụng mã giảm giá
	applyCoupon: async (code) => {
		try {
			// Gửi yêu cầu POST để xác nhận mã giảm giá
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true }); // Cập nhật coupon và trạng thái đã áp dụng
			get().calculateTotals(); // Tính toán lại tổng giỏ hàng sau khi áp dụng coupon
			toast.success("Coupon applied successfully"); // Hiển thị thông báo thành công
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm xóa mã giảm giá
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false }); // Xóa coupon khỏi store
		get().calculateTotals(); // Tính toán lại tổng giỏ hàng sau khi xóa coupon
		toast.success("Coupon removed"); // Hiển thị thông báo thành công
	},

	// Hàm lấy các sản phẩm trong giỏ hàng
	getCartItems: async () => {
		try {
			// Gửi yêu cầu GET để lấy sản phẩm trong giỏ hàng
			const res = await axios.get("/cart");
			set({ cart: res.data }); // Cập nhật giỏ hàng vào store
			get().calculateTotals(); // Tính toán lại tổng giỏ hàng
		} catch (error) {
			set({ cart: [] }); // Nếu có lỗi, đặt giỏ hàng là một mảng rỗng
			toast.error(error.response.data.message || "An error occurred"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm xóa toàn bộ giỏ hàng
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 }); // Đặt lại giỏ hàng, coupon, tổng và tổng phụ
	},

	// Hàm thêm sản phẩm vào giỏ hàng
	addToCart: async (product) => {
		try {
			// Gửi yêu cầu POST để thêm sản phẩm vào giỏ hàng
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart"); // Hiển thị thông báo thành công

			set((prevState) => {
				// Kiểm tra sản phẩm đã có trong giỏ hàng chưa
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					// Nếu có, tăng số lượng sản phẩm lên 1
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					// Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart }; // Cập nhật giỏ hàng mới
			});
			get().calculateTotals(); // Tính toán lại tổng giỏ hàng
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm xóa sản phẩm khỏi giỏ hàng
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } }); // Gửi yêu cầu DELETE để xóa sản phẩm
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) })); // Cập nhật lại giỏ hàng
		get().calculateTotals(); // Tính toán lại tổng giỏ hàng
	},

	// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			// Nếu số lượng bằng 0, xóa sản phẩm khỏi giỏ hàng
			get().removeFromCart(productId);
			return;
		}

		// Gửi yêu cầu PUT để cập nhật số lượng sản phẩm
		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)), // Cập nhật số lượng sản phẩm
		}));
		get().calculateTotals(); // Tính toán lại tổng giỏ hàng
	},

	// Hàm tính toán tổng giá trị của giỏ hàng
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Tính tổng phụ
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100); // Tính giảm giá từ coupon
			total = subtotal - discount; // Tính tổng sau giảm giá
		}

		set({ subtotal, total }); // Cập nhật tổng giá trị và tổng phụ vào store
	},
}));
