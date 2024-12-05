import { redis } from "../lib/redis.js"; // Import thư viện Redis
import cloudinary from "../lib/cloudinary.js"; // Import thư viện Cloudinary
import Product from "../models/product.model.js"; // Import model Product

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Truy vấn tất cả sản phẩm từ MongoDB
    res.json({ products }); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi trong controller getAllProducts:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Lấy danh sách sản phẩm nổi bật
export const getFeaturedProducts = async (req, res) => {
  try {
    // Kiểm tra trong Redis xem danh sách sản phẩm nổi bật đã được lưu chưa
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts)); // Nếu có trong cache Redis, trả về luôn
    }

    // Nếu không có trong cache, truy vấn từ MongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nổi bật" }); // Nếu không tìm thấy, trả về lỗi 404
    }

    // Lưu vào cache Redis để dùng lại sau
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts); // Trả về danh sách sản phẩm nổi bật
  } catch (error) {
    console.error("Lỗi trong controller getFeaturedProducts:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body; // Lấy dữ liệu từ request

    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" }); // Nếu thiếu dữ liệu, trả về lỗi
    }

    let cloudinaryResponse = null;
    // Nếu có ảnh, upload ảnh lên Cloudinary
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" }); // Upload ảnh
    }

    // Tạo sản phẩm mới trong MongoDB
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "", // Lưu URL ảnh từ Cloudinary
      category,
    });

    res.status(201).json(product); // Trả về sản phẩm vừa tạo
  } catch (error) {
    console.error("Lỗi trong controller createProduct:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" }); // Nếu không tìm thấy, trả về lỗi 404
    }

    // Nếu sản phẩm có ảnh, xóa ảnh từ Cloudinary
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // Lấy publicId từ URL ảnh
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`); // Xóa ảnh từ Cloudinary
        console.log("Xóa ảnh từ Cloudinary thành công");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error); // Ghi log lỗi nếu xóa ảnh thất bại
      }
    }

    await Product.findByIdAndDelete(req.params.id); // Xóa sản phẩm khỏi MongoDB
    res.json({ message: "Xóa sản phẩm thành công" }); // Trả về thông báo thành công
  } catch (error) {
    console.error("Lỗi trong controller deleteProduct:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Lấy sản phẩm ngẫu nhiên (gợi ý sản phẩm)
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } }, // Chọn ngẫu nhiên 4 sản phẩm
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } }, // Lấy một số trường cần thiết
    ]);
    res.json(products); // Trả về danh sách sản phẩm gợi ý
  } catch (error) {
    console.error("Lỗi trong controller getRecommendedProducts:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params; // Lấy danh mục từ URL

  try {
    if (!category) {
      return res.status(400).json({ message: "Danh mục không hợp lệ" }); // Nếu không có danh mục, trả về lỗi
    }

    const products = await Product.find({ category }); // Tìm sản phẩm theo danh mục
    if (!products || products.length === 0) {
      return res.status(404).json({ message: `Không có sản phẩm trong danh mục: ${category}` }); // Nếu không tìm thấy, trả về lỗi 404
    }

    res.json({ products }); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi trong controller getProductsByCategory:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Đảo trạng thái sản phẩm nổi bật (isFeatured)
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" }); // Nếu không tìm thấy, trả về lỗi 404
    }

    // Đảo trạng thái isFeatured
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save(); // Lưu thay đổi vào MongoDB

    // Cập nhật lại cache Redis
    await updateFeaturedProductsCache();

    res.json(updatedProduct); // Trả về sản phẩm đã cập nhật
  } catch (error) {
    console.error("Lỗi trong controller toggleFeaturedProduct:", error.message); // Ghi log lỗi
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message }); // Trả về lỗi server
  }
};

// Hàm cập nhật cache Redis khi thay đổi trạng thái sản phẩm nổi bật
async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); // Lấy danh sách sản phẩm nổi bật
    await redis.set("featured_products", JSON.stringify(featuredProducts)); // Lưu vào cache Redis
  } catch (error) {
    console.error("Lỗi khi cập nhật cache Redis:", error.message); // Ghi log lỗi
  }
}
