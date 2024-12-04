import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.error("Lỗi trong controller getAllProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // Kiểm tra trong Redis xem đã lưu danh sách sản phẩm nổi bật chưa
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts)); // Trả về ngay nếu có cache
    }

    // Truy vấn MongoDB nếu không có trong cache
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nổi bật" });
    }

    // Lưu vào Redis để dùng lại sau này
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.error("Lỗi trong controller getFeaturedProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    let cloudinaryResponse = null;
    // Nếu có ảnh, upload lên Cloudinary
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Lỗi trong controller createProduct:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Xóa ảnh từ Cloudinary nếu có
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Xóa ảnh từ Cloudinary thành công");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi trong controller deleteProduct:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
    ]);
    res.json(products);
  } catch (error) {
    console.error("Lỗi trong controller getRecommendedProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    if (!category) {
      return res.status(400).json({ message: "Danh mục không hợp lệ" });
    }

    const products = await Product.find({ category });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: `Không có sản phẩm trong danh mục: ${category}` });
    }

    res.json({ products });
  } catch (error) {
    console.error("Lỗi trong controller getProductsByCategory:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Đảo trạng thái featured
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    // Cập nhật lại cache Redis
    await updateFeaturedProductsCache();

    res.json(updatedProduct);
  } catch (error) {
    console.error("Lỗi trong controller toggleFeaturedProduct:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật cache Redis khi thay đổi trạng thái featured
async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Lỗi khi cập nhật cache Redis:", error.message);
  }
}
