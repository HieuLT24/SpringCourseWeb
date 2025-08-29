import axiosInstance from '../configs/Apis';

export const paymentHistoryService = {
    // Lấy lịch sử khóa học đã thanh toán thành công
    async getCourseHistory() {
        try {
            const response = await axiosInstance.get('payment-history/courses');

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching course history:', error);
            return {
                success: false,
                message: error.response?.data || 'Có lỗi xảy ra khi tải lịch sử khóa học'
            };
        }
    }
};
