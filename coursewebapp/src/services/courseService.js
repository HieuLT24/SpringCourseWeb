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
}

export const courseService = new CourseService();