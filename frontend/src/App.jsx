import { Navigate, Route, Routes } from "react-router-dom"; // Import các component từ react-router-dom để quản lý routing
import { useEffect } from "react"; // Import useEffect để thực thi mã khi component mount

import Navbar from "./components/Navbar"; // Import Navbar component
import LoadingSpinner from "./components/LoadingSpinner"; // Import LoadingSpinner component để hiển thị khi đang tải
import { Toaster } from "react-hot-toast"; // Import Toaster để hiển thị thông báo toast

import HomePage from "./pages/HomePage"; // Trang chủ
import SignUpPage from "./pages/SignUpPage"; // Trang đăng ký
import LoginPage from "./pages/LoginPage"; // Trang đăng nhập
import AdminPage from "./pages/AdminPage"; // Trang quản trị (dành cho admin)
import CategoryPage from "./pages/CategoryPage"; // Trang hiển thị sản phẩm theo danh mục
import CartPage from "./pages/CartPage"; // Trang giỏ hàng
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage"; // Trang hiển thị khi giao dịch thành công
import PurchaseCancelPage from "./pages/PurchaseCancelPage"; // Trang hiển thị khi giao dịch bị hủy

import { useUserStore } from "./stores/useUserStore"; // Import store người dùng
import { useCartStore } from "./stores/useCartStore"; // Import store giỏ hàng

function App() {
  // Trạng thái và hành động liên quan đến người dùng và giỏ hàng
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  // Kiểm tra xác thực khi ứng dụng khởi chạy
  useEffect(() => {
    checkAuth(); // Gọi hàm kiểm tra xác thực người dùng khi ứng dụng khởi chạy
  }, [checkAuth]); // Chạy lại mỗi khi hàm checkAuth thay đổi

  // Lấy danh sách sản phẩm trong giỏ hàng nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user) {
      getCartItems(); // Lấy giỏ hàng nếu có người dùng
    }
  }, [getCartItems, user]); // Chạy lại mỗi khi user hoặc getCartItems thay đổi

  // Hiển thị spinner khi đang kiểm tra xác thực người dùng
  if (checkingAuth) return <LoadingSpinner />; // Nếu đang kiểm tra xác thực, hiển thị loading spinner

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {/* Đặt một gradient background theo hình ellipse */}
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(100,210,255,0.3)_0%,rgba(50,130,200,0.2)_45%,rgba(10,70,120,0.1)_100%)]' />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="relative z-50 pt-20">
        <Navbar /> {/* Navbar component */}
        <Routes>
          {/* Định nghĩa các route cho các trang trong ứng dụng */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />} // Nếu chưa đăng nhập thì dẫn tới trang đăng ký, ngược lại chuyển hướng về trang chủ
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />} // Nếu chưa đăng nhập thì dẫn tới trang đăng nhập, ngược lại chuyển hướng về trang chủ
          />
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} // Nếu là admin thì vào trang admin, nếu không thì chuyển hướng về trang login
          />
          <Route path="/category/:category" element={<CategoryPage />} /> {/* Trang danh mục sản phẩm */}
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" />} // Nếu đã đăng nhập thì vào giỏ hàng, nếu không chuyển hướng về login
          />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} /> {/* Trang giao dịch thành công */}
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} /> {/* Trang giao dịch bị hủy */}
        </Routes>
      </div>

      {/* Thông báo Toast */}
      <Toaster /> {/* Hiển thị thông báo toast */}
    </div>
  );
}

export default App; // Xuất component App
