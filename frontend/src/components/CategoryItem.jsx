import { Link } from "react-router-dom"; // Nhập component Link từ thư viện react-router-dom để điều hướng trang mà không phải tải lại trang.

const CategoryItem = ({ category }) => { // Nhận đối tượng category chứa thông tin về danh mục.
    return (
        <div className='relative overflow-hidden h-96 w-full rounded-lg group'> 
            {/* Tạo một div chứa với chiều cao cố định, chiều rộng đầy đủ, có bo góc và ẩn phần thừa. */}
            <Link to={"/category" + category.href}> 
                {/* Sử dụng Link để điều hướng đến trang danh mục, đường dẫn được tạo bằng category.href */}
                <div className='w-full h-full cursor-pointer'> 
                    {/* Div này bao quanh toàn bộ phần tử hình ảnh, với kích thước đầy đủ và khi hover sẽ thay đổi con trỏ thành bàn tay */}
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' /> 
                    {/* Tạo một lớp phủ gradient để làm mờ ảnh nền, giúp văn bản dễ nhìn hơn */}
                    <img
                        src={category.imageUrl} 
                        alt={category.name} 
                        className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110' 
                        loading='lazy'
                    />
                    {/* Hình ảnh danh mục sẽ được căn chỉnh để bao phủ toàn bộ khu vực, có hiệu ứng phóng to khi hover */}
                    <div className='absolute bottom-0 left-0 right-0 p-4 z-20'> 
                        {/* Phần văn bản thông tin của danh mục được đặt ở phía dưới */}
                        <h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3> 
                        {/* Tên danh mục với màu chữ trắng và cỡ chữ lớn */}
                        <p className='text-gray-200 text-sm'>Explore {category.name}</p> 
                        {/* Mô tả ngắn về danh mục, màu xám và cỡ chữ nhỏ */}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CategoryItem;
