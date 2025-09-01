import axios from '../configs/Apis';
import { endpoints, buildUrl } from '../configs/Apis';

class CourseService {
  async getAllCourses(params = {}) {
    try {
      const response = await axios.get(endpoints.courses.getAll, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCourseById(courseId) {
    try {
      const url = buildUrl(endpoints.courses.getById, { courseId });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getListCategories(page=1) {
    try {
      const response = await axios.get(endpoints.courses.getListCategories, { params: { page } });
      const data = response.data;
      return Array.isArray(data) ? data : (data?.categories || []);
    } catch (error) {
      throw error;
    }
  }

  async getCategories(page=1) {
    try {
      const response = await axios.get(endpoints.courses.getCategories, { params: { page } });
      const data = response.data;
      return Array.isArray(data) ? data : (data?.categories || []);
    } catch (error) {
      throw error;
    }
  }

  async getCoursesByCategory(cateId, page = 1) {
    try {
      const response = await axios.get(endpoints.courses.getAll, {
        params: { cateId, page }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchCourses(keyword, filters = {}) {
    try {
      const params = { kw: keyword, ...filters };
      const response = await axios.get(endpoints.courses.getAll, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(courseData) {
    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('price', courseData.price);
      formData.append('categoryName', courseData.categoryName);
      
      if (courseData.image) {
        formData.append('image', courseData.image);
      }

      console.log('Sending course data:', {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        categoryName: courseData.categoryName,
        hasImage: !!courseData.image
      });

      const response = await axios.post(endpoints.courses.create, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in createCourse service:', error);
      
      // Xử lý lỗi chi tiết hơn
      if (error.response) {
        // Server trả về lỗi
        console.error('Server error response:', error.response.data);
        const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi tạo khóa học';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không thể kết nối đến server
        console.error('Network error:', error.request);
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Lỗi khác
        console.error('Other error:', error.message);
        throw new Error(error.message || 'Có lỗi xảy ra khi tạo khóa học');
      }
    }
  }
}

export const courseService = new CourseService();