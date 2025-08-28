import axios from '../configs/Apis';
import { endpoints } from '../configs/Apis';

class StatsService {
  async getRevenues() {
    try {
      const response = await axios.get(endpoints.stats.revenues);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thống kê doanh thu thất bại' 
      };
    }
  }
}

export const statsService = new StatsService();
