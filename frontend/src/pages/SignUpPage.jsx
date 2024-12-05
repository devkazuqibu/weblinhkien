import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react"; // Import các icon cần dùng
import { motion } from "framer-motion"; // Import framer-motion để tạo hiệu ứng chuyển động
import { useUserStore } from "../stores/useUserStore"; // Import store người dùng để xử lý đăng ký

const SignUpPage = () => {
	const [formData, setFormData] = useState({ // Khởi tạo state để lưu trữ dữ liệu form
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, loading } = useUserStore(); // Lấy hàm đăng ký và trạng thái loading từ store

	// Hàm xử lý khi người dùng gửi form
	const handleSubmit = (e) => {
		e.preventDefault(); // Ngừng hành động mặc định của form (không reload trang)
		signup(formData); // Gọi hàm đăng ký từ store với dữ liệu người dùng
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'> 
			{/* Wrapper chính chứa toàn bộ nội dung của trang đăng ký */}
			
			<motion.div 
				className='sm:mx-auto sm:w-full sm:max-w-md' 
				initial={{ opacity: 0, y: -20 }} 
				animate={{ opacity: 1, y: 0 }} 
				transition={{ duration: 0.8 }}
			>
				{/* Phần tiêu đề của trang đăng ký */}
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>
					Create your account
				</h2>
			</motion.div>

			<motion.div 
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md' 
				initial={{ opacity: 0, y: 20 }} 
				animate={{ opacity: 1, y: 0 }} 
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				{/* Form đăng ký */}
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Trường nhập Tên */}
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
								Full name
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='name'
									type='text'
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='John Doe'
								/>
							</div>
						</div>

						{/* Trường nhập Email */}
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
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						{/* Trường nhập Mật khẩu */}
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
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Trường nhập Xác nhận mật khẩu */}
						<div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
								Confirm Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='confirmPassword'
									type='password'
									required
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* Nút đăng ký */}
						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading} // Vô hiệu hóa nút khi đang loading
						>
							{loading ? ( // Nếu đang loading, hiển thị vòng quay và chữ "Loading..."
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : ( // Nếu không loading, hiển thị nút đăng ký
								<>
									<UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
									Sign up
								</>
							)}
						</button>
					</form>

					{/* Liên kết chuyển đến trang đăng nhập */}
					<p className='mt-8 text-center text-sm text-gray-400'>
						Already have an account?{" "}
						<Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Login here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default SignUpPage;
