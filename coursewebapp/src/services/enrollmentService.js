import axios from '../configs/Apis';
import { endpoints, buildUrl } from '../configs/Apis';

class EnrollmentService {
  async enrollCourse(courseId) {
    try {
      const url = buildUrl(endpoints.enrollments.enroll, { courseId });
      const response = await axios.post(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký khóa học thất bại' 
      };
    }
  }

  async getEnrolledCourses(userId) {
    try {
      // Sử dụng endpoint courses với params để lấy khóa học đã đăng ký
      const response = await axios.get(endpoints.courses.getAll);
      return response.data.myCourses || [];
    } catch (error) {
      throw error;
    }
  }

  async checkEnrollmentStatus(userId, courseId) {
    try {
      const response = await axios.get(endpoints.courses.getById, {
        params: { courseId }
      });
      return response.data.isEnrolled || false;
    } catch (error) {
      return false;
    }
  }
}

export const enrollmentService = new EnrollmentService();
