import { create } from "zustand"; // Import thư viện zustand để tạo store quản lý trạng thái
import axios from "../lib/axios"; // Import axios để thực hiện các yêu cầu HTTP
import { toast } from "react-hot-toast"; // Import thư viện toast để hiển thị thông báo

// Tạo một store sử dụng zustand để quản lý trạng thái người dùng
export const useUserStore = create((set) => ({
  user: null, // Trạng thái người dùng, ban đầu là null (chưa đăng nhập)
  loading: false, // Trạng thái loading, ban đầu là false
  checkingAuth: false, // Trạng thái kiểm tra đăng nhập, ban đầu là false

  // Hàm đăng ký người dùng mới
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu đăng ký

    // Kiểm tra nếu mật khẩu không khớp với xác nhận mật khẩu
    if (password !== confirmPassword) {
      set({ loading: false }); // Đặt trạng thái loading là false khi có lỗi
      return toast.error("Passwords do not match"); // Hiển thị thông báo lỗi
    }

    try {
      // Gửi yêu cầu POST để đăng ký người dùng mới
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false }); // Lưu thông tin người dùng vào store và tắt loading
    } catch (error) {
      set({ loading: false }); // Tắt trạng thái loading khi có lỗi
      toast.error(error.response.data.message || "An error occurred"); // Hiển thị thông báo lỗi
    }
  },

  // Hàm đăng nhập
  login: async (email, password) => {
    set({ loading: true }); // Đặt trạng thái loading là true khi bắt đầu đăng nhập

    try {
      // Gửi yêu cầu POST để đăng nhập
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false }); // Lưu thông tin người dùng vào store và tắt loading
    } catch (error) {
      set({ loading: false }); // Tắt trạng thái loading khi có lỗi
      toast.error(error.response.data.message || "An error occurred"); // Hiển thị thông báo lỗi
    }
  },

  // Hàm đăng xuất
  logout: async () => {
    try {
      // Gửi yêu cầu POST để đăng xuất
      await axios.post("/auth/logout");
      set({ user: null }); // Xóa thông tin người dùng khỏi store (đăng xuất)
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout"); // Hiển thị thông báo lỗi nếu có
    }
  },

  // Hàm kiểm tra trạng thái đăng nhập (kiểm tra xem người dùng đã đăng nhập hay chưa)
  checkAuth: async () => {
    set({ checkingAuth: true }); // Đặt trạng thái checkingAuth là true khi bắt đầu kiểm tra

    try {
      // Gửi yêu cầu GET để lấy thông tin người dùng hiện tại
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false }); // Lưu thông tin người dùng vào store và tắt checkingAuth
    } catch (error) {
      console.log(error.message); // In ra lỗi trong console nếu có
      set({ checkingAuth: false, user: null }); // Đặt lại trạng thái khi có lỗi, người dùng là null
    }
  },
}));
