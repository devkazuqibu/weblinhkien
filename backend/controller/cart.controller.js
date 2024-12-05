import Product from '../models/product.model.js'; // Import model Product từ file model

// Hàm lấy danh sách sản phẩm trong giỏ hàng
export const getCartProducts = async (req, res) => {
	try {
		// Lấy danh sách sản phẩm từ cơ sở dữ liệu dựa trên các ID trong giỏ hàng của người dùng
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// Thêm số lượng (quantity) cho mỗi sản phẩm
		const cartItems = products.map((product) => {
			// Tìm số lượng của sản phẩm trong giỏ hàng người dùng
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity }; // Kết hợp dữ liệu sản phẩm với quantity
		});

		// Trả về danh sách sản phẩm trong giỏ hàng
		res.json(cartItems);
	} catch (error) {
		// Log lỗi và trả về phản hồi lỗi
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body; // Lấy productId từ body của request
		const user = req.user; // Lấy thông tin người dùng từ middleware

		// Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
		const existingItem = user.cartItems.find((item) => item.id === productId);
		if (existingItem) {
			// Nếu đã tồn tại, tăng số lượng lên 1
			existingItem.quantity += 1;
		} else {
			// Nếu chưa tồn tại, thêm sản phẩm vào giỏ hàng
			user.cartItems.push(productId);
		}

		// Lưu thay đổi vào cơ sở dữ liệu
		await user.save();
		res.json(user.cartItems); // Trả về giỏ hàng đã cập nhật
	} catch (error) {
		// Log lỗi và trả về phản hồi lỗi
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Hàm xóa toàn bộ sản phẩm hoặc một sản phẩm khỏi giỏ hàng
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body; // Lấy productId từ body của request
		const user = req.user; // Lấy thông tin người dùng từ middleware

		if (!productId) {
			// Nếu không có productId, xóa toàn bộ giỏ hàng
			user.cartItems = [];
		} else {
			// Nếu có productId, xóa sản phẩm cụ thể khỏi giỏ hàng
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}

		// Lưu thay đổi vào cơ sở dữ liệu
		await user.save();
		res.json(user.cartItems); // Trả về giỏ hàng đã cập nhật
	} catch (error) {
		// Trả về phản hồi lỗi
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params; // Lấy productId từ params của request
		const { quantity } = req.body; // Lấy quantity từ body của request
		const user = req.user; // Lấy thông tin người dùng từ middleware

		// Kiểm tra sản phẩm có tồn tại trong giỏ hàng hay không
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				// Nếu quantity = 0, xóa sản phẩm khỏi giỏ hàng
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems); // Trả về giỏ hàng đã cập nhật
			}

			// Cập nhật số lượng sản phẩm
			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems); // Trả về giỏ hàng đã cập nhật
		} else {
			// Nếu sản phẩm không tồn tại, trả về lỗi 404
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		// Log lỗi và trả về phản hồi lỗi
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
