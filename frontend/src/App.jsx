import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  // Kiểm tra xác thực khi ứng dụng khởi chạy
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Lấy danh sách sản phẩm trong giỏ hàng nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  // Hiển thị spinner khi đang kiểm tra xác thực
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
		<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(100,210,255,0.3)_0%,rgba(50,130,200,0.2)_45%,rgba(10,70,120,0.1)_100%)]' />

        </div>
      </div>

      {/* Nội dung chính */}
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
        </Routes>
      </div>

      {/* Thông báo Toast */}
      <Toaster />
    </div>
  );
}

export default App;
