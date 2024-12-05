// Định nghĩa một component hiển thị biểu tượng tải (loading spinner)
const LoadingSpinner = () => {
    return (
        // Div cha bao bọc toàn bộ spinner, căn giữa nội dung và thiết lập nền tối
        <div className='flex items-center justify-center min-h-screen bg-gray-900'>
            <div className='relative'> {/* Div chứa các vòng tròn của spinner */}
                {/* Vòng tròn ngoài cùng, chỉ là một đường viền tĩnh */}
                <div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />
                
                {/* Vòng tròn bên trong, được áp dụng hiệu ứng xoay để tạo chuyển động */}
                <div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
                
                {/* Phần văn bản chỉ dành cho công cụ hỗ trợ truy cập */}
                <div className='sr-only'>Loading</div> {/* Dùng cho trình đọc màn hình */}
            </div>
        </div>
    );
};

// Xuất component để sử dụng trong các phần khác của ứng dụng
export default LoadingSpinner;
