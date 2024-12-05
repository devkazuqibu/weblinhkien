import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Hàm lấy dữ liệu phân tích tổng quan
export const getAnalyticsData = async () => {
    // Đếm tổng số người dùng từ collection User
    const totalUsers = await User.countDocuments();

    // Đếm tổng số sản phẩm từ collection Product
    const totalProducts = await Product.countDocuments();

    // Lấy dữ liệu thống kê bán hàng từ collection Order
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // Gom tất cả các tài liệu (documents) lại thành 1 nhóm
                totalSales: { $sum: 1 }, // Tổng số đơn hàng
                totalRevenue: { $sum: "$totalAmount" }, // Tổng doanh thu
            },
        },
    ]);

    // Nếu không có dữ liệu bán hàng thì gán mặc định là 0
    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    // Trả về dữ liệu phân tích tổng quan
    return {
        users: totalUsers, // Tổng số người dùng
        products: totalProducts, // Tổng số sản phẩm
        totalSales, // Tổng số đơn hàng
        totalRevenue, // Tổng doanh thu
    };
};

// Hàm lấy dữ liệu bán hàng theo ngày trong khoảng thời gian
export const getDailySalesData = async (startDate, endDate) => {
    try {
        // Lấy dữ liệu bán hàng theo ngày từ collection Order
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate, // Ngày bắt đầu
                        $lte: endDate, // Ngày kết thúc
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Nhóm theo ngày
                    sales: { $sum: 1 }, // Tổng số đơn hàng trong ngày
                    revenue: { $sum: "$totalAmount" }, // Tổng doanh thu trong ngày
                },
            },
            { $sort: { _id: 1 } }, // Sắp xếp dữ liệu theo thứ tự ngày tăng dần
        ]);

        // Tạo danh sách các ngày trong khoảng thời gian
        const dateArray = getDatesInRange(startDate, endDate);
        // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

        // Duyệt qua danh sách các ngày và kết hợp dữ liệu
        return dateArray.map((date) => {
            // Tìm dữ liệu bán hàng của ngày hiện tại
            const foundData = dailySalesData.find((item) => item._id === date);

            return {
                date, // Ngày
                sales: foundData?.sales || 0, // Số lượng đơn hàng, mặc định là 0 nếu không có
                revenue: foundData?.revenue || 0, // Doanh thu, mặc định là 0 nếu không có
            };
        });
    } catch (error) {
        throw error; // Ném lỗi nếu có vấn đề
    }
};

// Hàm tạo danh sách các ngày trong khoảng thời gian
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate); // Bắt đầu từ ngày startDate

    // Lặp qua từng ngày cho đến khi vượt quá endDate
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]); // Thêm ngày vào danh sách (định dạng YYYY-MM-DD)
        currentDate.setDate(currentDate.getDate() + 1); // Tăng ngày lên 1
    }

    return dates; // Trả về danh sách các ngày
}