import { motion } from "framer-motion"; // Sử dụng thư viện framer-motion để tạo hiệu ứng chuyển động
import { Trash, Star } from "lucide-react"; // Import các biểu tượng Trash và Star từ lucide-react
import { useProductStore } from "../stores/useProductStore"; // Import hook tùy chỉnh useProductStore để quản lý trạng thái sản phẩm

const ProductsList = () => {
  // Lấy các hàm deleteProduct, toggleFeaturedProduct và danh sách sản phẩm từ store
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  console.log("products", products); // In ra danh sách sản phẩm để kiểm tra

  return (
    <motion.div // Sử dụng motion.div để tạo hiệu ứng mượt mà khi hiển thị component
      className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto' // Các lớp CSS cho giao diện của bảng
      initial={{ opacity: 0, y: 20 }} // Hiệu ứng khi component mới được render
      animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi component hoàn thành render
      transition={{ duration: 0.8 }} // Đặt thời gian hiệu ứng chuyển động
    >
      <table className='min-w-full divide-y divide-gray-700'> {/* Bảng hiển thị danh sách sản phẩm */}
        <thead className='bg-gray-700'>
          <tr> {/* Định nghĩa các cột trong bảng */}
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
              Product
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
              Price
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
              Category
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
              Featured
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>

        <tbody className='bg-gray-800 divide-y divide-gray-700'>
          {products?.map((product) => ( // Lặp qua mỗi sản phẩm trong danh sách sản phẩm
            <tr key={product._id} className='hover:bg-gray-700'> {/* Mỗi dòng sản phẩm có hiệu ứng hover */}
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10'>
                    <img className='h-10 w-10 rounded-full object-cover' src={product.image} alt={product.name} /> {/* Hình ảnh sản phẩm */}
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-white'>{product.name}</div> {/* Tên sản phẩm */}
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div> {/* Giá sản phẩm */}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.category}</div> {/* Danh mục sản phẩm */}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <button
                  onClick={() => toggleFeaturedProduct(product._id)} // Khi nhấn, chuyển đổi trạng thái nổi bật của sản phẩm
                  className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className='h-5 w-5' /> {/* Biểu tượng ngôi sao để đánh dấu sản phẩm nổi bật */}
                </button>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <button
                  onClick={() => deleteProduct(product._id)} // Khi nhấn, gọi hàm xóa sản phẩm
                  className='text-red-400 hover:text-red-300'
                >
                  <Trash className='h-5 w-5' /> {/* Biểu tượng thùng rác để xóa sản phẩm */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
