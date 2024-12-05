// Import các module cần thiết
import { motion } from "framer-motion"; // Thư viện hỗ trợ hiệu ứng động
import { useEffect, useState } from "react"; // Hook để quản lý state và lifecycle
import { useCartStore } from "../stores/useCartStore"; // Hook custom để làm việc với store giỏ hàng

// Component hiển thị thẻ mã giảm giá hoặc phiếu quà tặng
const GiftCouponCard = () => {
    // Khai báo state để lưu mã giảm giá do người dùng nhập
    const [userInputCode, setUserInputCode] = useState("");
    
    // Lấy các biến và hàm từ store giỏ hàng
    const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();
    
    // useEffect gọi hàm lấy mã giảm giá của người dùng khi component được render lần đầu
    useEffect(() => {
        getMyCoupon();
    }, [getMyCoupon]);
    
    // Khi `coupon` thay đổi, tự động đồng bộ giá trị với ô nhập mã giảm giá
    useEffect(() => {
        if (coupon) setUserInputCode(coupon.code);
    }, [coupon]);
    
    // Hàm xử lý áp dụng mã giảm giá khi người dùng nhấn nút "Apply Code"
    const handleApplyCoupon = () => {
        if (!userInputCode) return; // Nếu ô nhập trống, không làm gì
        applyCoupon(userInputCode); // Gọi hàm áp dụng mã với giá trị hiện tại
    };
    
    // Hàm xử lý gỡ bỏ mã giảm giá
    const handleRemoveCoupon = async () => {
        await removeCoupon(); // Gọi hàm từ store để xóa mã giảm giá
        setUserInputCode(""); // Đặt lại giá trị ô nhập mã giảm giá
    };

    // Render giao diện chính
    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6' // Styling CSS
            initial={{ opacity: 0, y: 20 }} // Hiệu ứng ban đầu khi xuất hiện
            animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi chuyển sang trạng thái hiển thị
            transition={{ duration: 0.5, delay: 0.2 }} // Thời gian chuyển đổi hiệu ứng
        >
            <div className='space-y-4'>
                {/* Ô nhập mã giảm giá */}
                <div>
                    <label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
                        Do you have a voucher or gift card? {/* Tiêu đề ô nhập */}
                    </label>
                    <input
                        type='text'
                        id='voucher'
                        className='block w-full rounded-lg border border-gray-600 bg-gray-700 
                        p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
                        focus:ring-emerald-500' // Styling CSS với focus
                        placeholder='Enter code here' // Gợi ý cho người dùng
                        value={userInputCode} // Liên kết giá trị với state
                        onChange={(e) => setUserInputCode(e.target.value)} // Cập nhật state khi nhập
                        required // Bắt buộc nhập
                    />
                </div>

                {/* Nút áp dụng mã giảm giá */}
                <motion.button
                    type='button'
                    className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    whileHover={{ scale: 1.05 }} // Phóng to khi hover
                    whileTap={{ scale: 0.95 }} // Nhỏ lại khi nhấn
                    onClick={handleApplyCoupon} // Gọi hàm áp dụng mã
                >
                    Apply Code {/* Văn bản trên nút */}
                </motion.button>
            </div>

            {/* Hiển thị thông tin mã giảm giá đã áp dụng */}
            {isCouponApplied && coupon && (
                <div className='mt-4'>
                    <h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3> {/* Tiêu đề */}
                    <p className='mt-2 text-sm text-gray-400'>
                        {coupon.code} - {coupon.discountPercentage}% off {/* Mã giảm giá và phần trăm giảm */}
                    </p>

                    {/* Nút gỡ bỏ mã giảm giá */}
                    <motion.button
                        type='button'
                        className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
                        px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
                        focus:ring-4 focus:ring-red-300'
                        whileHover={{ scale: 1.05 }} // Phóng to khi hover
                        whileTap={{ scale: 0.95 }} // Nhỏ lại khi nhấn
                        onClick={handleRemoveCoupon} // Gọi hàm xóa mã
                    >
                        Remove Coupon {/* Văn bản trên nút */}
                    </motion.button>
                </div>
            )}

            {/* Hiển thị thông tin mã giảm giá sẵn có (nếu có) */}
            {coupon && (
                <div className='mt-4'>
                    <h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3> {/* Tiêu đề */}
                    <p className='mt-2 text-sm text-gray-400'>
                        {coupon.code} - {coupon.discountPercentage}% off {/* Mã giảm giá và phần trăm giảm */}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

// Xuất component để sử dụng ở nơi khác
export default GiftCouponCard;
