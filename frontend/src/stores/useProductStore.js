import { create } from "zustand"; // Import thư viện zustand để tạo store quản lý trạng thái toàn cục
import toast from "react-hot-toast"; // Import thư viện toast để hiển thị thông báo
import axios from "../lib/axios"; // Import axios để thực hiện các yêu cầu HTTP

// Tạo một store sử dụng zustand để quản lý sản phẩm
export const useProductStore = create((set) => ({
	// Trạng thái ban đầu của sản phẩm và trạng thái loading
	products: [],
	loading: false,

	// Hàm cập nhật danh sách sản phẩm vào store
	setProducts: (products) => set({ products }),

	// Hàm tạo mới một sản phẩm
	createProduct: async (productData) => {
		set({ loading: true }); // Đặt loading là true khi bắt đầu tạo sản phẩm
		try {
			// Gửi yêu cầu POST để tạo sản phẩm mới
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data], // Thêm sản phẩm mới vào danh sách sản phẩm
				loading: false, // Đặt lại trạng thái loading sau khi tạo xong
			}));
		} catch (error) {
			toast.error(error.response.data.error); // Hiển thị thông báo lỗi nếu có
			set({ loading: false }); // Đặt lại loading là false khi có lỗi
		}
	},

	// Hàm lấy tất cả sản phẩm từ server
	fetchAllProducts: async () => {
		set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu lấy sản phẩm
		try {
			// Gửi yêu cầu GET để lấy tất cả sản phẩm
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false }); // Cập nhật danh sách sản phẩm và trạng thái loading
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false }); // Cập nhật lỗi nếu không lấy được sản phẩm
			toast.error(error.response.data.error || "Failed to fetch products"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm lấy sản phẩm theo danh mục
	fetchProductsByCategory: async (category) => {
		set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu lấy sản phẩm theo danh mục
		try {
			// Gửi yêu cầu GET để lấy sản phẩm theo danh mục
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false }); // Cập nhật sản phẩm và trạng thái loading
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false }); // Cập nhật lỗi nếu không lấy được sản phẩm
			toast.error(error.response.data.error || "Failed to fetch products"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm xóa sản phẩm khỏi danh sách
	deleteProduct: async (productId) => {
		set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu xóa sản phẩm
		try {
			// Gửi yêu cầu DELETE để xóa sản phẩm
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId), // Xóa sản phẩm khỏi danh sách
				loading: false, // Đặt lại trạng thái loading
			}));
		} catch (error) {
			set({ loading: false }); // Đặt lại loading khi có lỗi
			toast.error(error.response.data.error || "Failed to delete product"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm cập nhật sản phẩm là sản phẩm nổi bật (featured)
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu cập nhật sản phẩm
		try {
			// Gửi yêu cầu PATCH để cập nhật thuộc tính 'isFeatured' của sản phẩm
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product // Cập nhật thuộc tính isFeatured
				),
				loading: false, // Đặt lại trạng thái loading
			}));
		} catch (error) {
			set({ loading: false }); // Đặt lại trạng thái loading khi có lỗi
			toast.error(error.response.data.error || "Failed to update product"); // Hiển thị thông báo lỗi
		}
	},

	// Hàm lấy các sản phẩm nổi bật
	fetchFeaturedProducts: async () => {
		set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu lấy sản phẩm nổi bật
		try {
			// Gửi yêu cầu GET để lấy sản phẩm nổi bật
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false }); // Cập nhật sản phẩm nổi bật và trạng thái loading
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false }); // Cập nhật lỗi nếu không lấy được sản phẩm
			console.log("Error fetching featured products:", error); // In ra lỗi trong console
		}
	},
}));
