// Import các icon từ thư viện Lucide và các thư viện cần thiết như React Router và các store
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore"; // Lấy thông tin người dùng từ store
import { useCartStore } from "../stores/useCartStore"; // Lấy thông tin giỏ hàng từ store

const Navbar = () => {
    // Lấy thông tin người dùng (user) và hàm đăng xuất (logout) từ store
    const { user, logout } = useUserStore();
    // Kiểm tra xem người dùng có quyền admin không
    const isAdmin = user?.role === "admin";
    // Lấy thông tin giỏ hàng (cart) từ store
    const { cart } = useCartStore();

    return (
        // Thanh điều hướng (navbar) được cố định ở đầu trang
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    {/* Logo của trang web */}
                    <Link to='/' className='text-2xl font-bold text-[#0d6efd] items-center space-x-2 flex'>
                        PhongVu.vn
                    </Link>

                    {/* Menu điều hướng */}
                    <nav className='flex flex-wrap items-center gap-4'>
                        {/* Liên kết đến trang chủ */}
                        <Link
                            to={"/"}
                            className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                        >
                            Home
                        </Link>

                        {/* Hiển thị giỏ hàng nếu người dùng đã đăng nhập */}
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                            >
                                {/* Icon giỏ hàng */}
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Cart</span>

                                {/* Số lượng sản phẩm trong giỏ hàng (nếu có) */}
                                {cart.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Hiển thị liên kết quản trị nếu người dùng là admin */}
                        {isAdmin && (
                            <Link
                                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
                                to={"/secret-dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {/* Hiển thị nút đăng xuất nếu người dùng đã đăng nhập */}
                        {user ? (
                            <button
                                className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className='hidden sm:inline ml-2'>Log Out</span>
                            </button>
                        ) : (
                            // Nếu chưa đăng nhập, hiển thị các nút Đăng ký và Đăng nhập
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <LogIn className='mr-2' size={18} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar; // Xuất component để sử dụng trong các phần khác của ứng dụng
