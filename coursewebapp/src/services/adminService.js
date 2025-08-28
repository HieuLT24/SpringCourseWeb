import axios from '../configs/Apis';
import { endpoints, buildUrl } from '../configs/Apis';

class AdminService {
  async getAdminDashboard(params = {}) {
    try {
      const response = await axios.get(endpoints.admin.dashboard, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy dashboard admin thất bại' 
      };
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(endpoints.admin.getCategories);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách danh mục thất bại' 
      };
    }
  }

  async listCourses(params = {}) {
    try {
      const response = await axios.get(endpoints.admin.listCourses, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách khóa học thất bại' 
      };
    }
  }

  async getCourse(courseId) {
    try {
      const url = buildUrl(endpoints.admin.getCourse, { courseId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thông tin khóa học thất bại' 
      };
    }
  }

  async saveCourse(courseData) {
    try {
      const response = await axios.post(endpoints.admin.saveCourse, courseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lưu khóa học thất bại' 
      };
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const url = buildUrl(endpoints.admin.updateCourse, { courseId });
      const response = await axios.put(url, courseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật khóa học thất bại' 
      };
    }
  }

  async deleteCourse(courseId) {
    try {
      const url = buildUrl(endpoints.admin.deleteCourse, { courseId });
      const response = await axios.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xóa khóa học thất bại' 
      };
    }
  }

  async getStats() {
    try {
      const response = await axios.get(endpoints.admin.getStats);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thống kê thất bại' 
      };
    }
  }
}

export const adminService = new AdminService();
