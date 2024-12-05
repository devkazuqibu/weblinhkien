import { useState } from "react"; // Hook useState để quản lý trạng thái của email và password
import { motion } from "framer-motion"; // Thư viện để tạo hiệu ứng động
import { Link } from "react-router-dom"; // Để tạo liên kết đến trang đăng ký
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react"; // Các icon từ lucide-react
import { useUserStore } from "../stores/useUserStore"; // Lấy trạng thái và hành động từ store người dùng

const LoginPage = () => {
	// Tạo các state để lưu trữ email và mật khẩu
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Lấy hành động login và trạng thái loading từ store
	const { login, loading } = useUserStore();

	// Hàm xử lý khi người dùng gửi biểu mẫu
	const handleSubmit = (e) => {
		e.preventDefault(); // Ngừng hành động mặc định (trang sẽ không tải lại)
		console.log(email, password); // In email và mật khẩu ra console (dùng cho debug)
		login(email, password); // Gọi hành động login từ store
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			{/* Đoạn motion tạo hiệu ứng khi tiêu đề hiển thị */}
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create your account</h2>
			</motion.div>

			{/* Form đăng nhập */}
			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Trường nhập email */}
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-300'>
								Email address
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)} // Cập nhật email
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						{/* Trường nhập mật khẩu */}
						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>
								Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)} // Cập nhật mật khẩu
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Nút gửi form */}
						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading} // Vô hiệu nút khi đang tải
						>
							{/* Hiển thị Loader khi đang tải */}
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>
					</form>

					{/* Liên kết sang trang đăng ký */}
					<p className='mt-8 text-center text-sm text-gray-400'>
						Not a member?{" "}
						<Link to='/signup' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Sign up now <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;
