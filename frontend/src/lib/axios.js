import axios from "axios"; // Import thư viện axios để thực hiện các yêu cầu HTTP

// Tạo một instance của axios với các cấu hình tùy chỉnh
const axiosInstance = axios.create({
  baseURL: import.meta.mode === "development" ? "http://localhost:5001/api" : "/api", // Dựa trên môi trường (development hoặc production), xác định URL cơ sở của API.
  withCredentials: true, // Thiết lập gửi cookie với mỗi yêu cầu đến server, hỗ trợ xác thực bằng cookie (nếu có)
});

// Xuất instance axios tùy chỉnh để sử dụng trong các phần khác của ứng dụng
export default axiosInstance;
