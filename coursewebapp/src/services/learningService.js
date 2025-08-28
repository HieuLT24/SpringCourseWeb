import axios from '../configs/Apis';
import { endpoints, buildUrl } from '../configs/Apis';

class LearningService {
  async getMyCourses() {
    try {
      const response = await axios.get(endpoints.courses.getAll);
      return response.data.myCourses || [];
    } catch (error) {
      return [];
    }
  }
  async getLearningDashboard(courseId) {
    try {
      const url = buildUrl(endpoints.learning.dashboard, { courseId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy dashboard học tập thất bại' 
      };
    }
  }

  async getLectures(courseId) {
    try {
      const url = buildUrl(endpoints.learning.getLectures, { courseId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách bài giảng thất bại' 
      };
    }
  }

  async getExams(courseId) {
    try {
      const url = buildUrl(endpoints.learning.getExams, { courseId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách bài thi thất bại' 
      };
    }
  }

  async getExamQuestions(courseId, examId) {
    try {
      const url = buildUrl(endpoints.learning.getExamQuestions, { courseId, examId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách câu hỏi thất bại' 
      };
    }
  }

  async viewLecture(courseId, lectureId) {
    try {
      const url = buildUrl(endpoints.learning.viewLecture, { courseId, lectureId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xem bài giảng thất bại' 
      };
    }
  }

  async takeExam(courseId, examId) {
    try {
      const url = buildUrl(endpoints.learning.takeExam, { courseId, examId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Làm bài thi thất bại' 
      };
    }
  }

  async submitExam(courseId, examId, examData) {
    try {
      const url = buildUrl(endpoints.learning.submitExam, { courseId, examId });
      const response = await axios.post(url, examData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Nộp bài thi thất bại' 
      };
    }
  }

  async getForum(courseId) {
    try {
      const url = buildUrl(endpoints.learning.getForum, { courseId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thông tin forum thất bại' 
      };
    }
  }

  async getPosts(courseId) {
    try {
      const url = buildUrl(endpoints.learning.getPosts, { courseId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách bài viết thất bại' 
      };
    }
  }

  async createPost(courseId, postData) {
    try {
      const url = buildUrl(endpoints.learning.createPost, { courseId });
      const response = await axios.post(url, postData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Tạo bài viết thất bại' 
      };
    }
  }

  async getPost(courseId, postId) {
    try {
      const url = buildUrl(endpoints.learning.getPost, { courseId, postId });
      const response = await axios.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy bài viết thất bại' 
      };
    }
  }

  async updatePost(courseId, postId, postData) {
    try {
      const url = buildUrl(endpoints.learning.updatePost, { courseId, postId });
      const response = await axios.put(url, postData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật bài viết thất bại' 
      };
    }
  }

  async deletePost(courseId, postId) {
    try {
      const url = buildUrl(endpoints.learning.deletePost, { courseId, postId });
      const response = await axios.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xóa bài viết thất bại' 
      };
    }
  }

  async createComment(courseId, postId, commentData) {
    try {
      const url = buildUrl(endpoints.learning.createComment, { courseId, postId });
      const response = await axios.post(url, commentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Tạo comment thất bại' 
      };
    }
  }

  async updateComment(courseId, postId, commentId, commentData) {
    try {
      const url = buildUrl(endpoints.learning.updateComment, { courseId, postId, commentId });
      const response = await axios.put(url, commentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật comment thất bại' 
      };
    }
  }

  async deleteComment(courseId, postId, commentId) {
    try {
      const url = buildUrl(endpoints.learning.deleteComment, { courseId, postId, commentId });
      const response = await axios.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xóa comment thất bại' 
      };
    }
  }
}

export const learningService = new LearningService();
