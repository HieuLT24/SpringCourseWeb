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
  
  async getTeacherCourses() {
    try {
      const response = await axios.get(endpoints.courses.getTeacherCourses);
      if (response.data.success) {
        return {
          success: true,
          activeCourses: response.data.activeCourses || [],
          pendingCourses: response.data.pendingCourses || [],
          totalActive: response.data.totalActive || 0,
          totalPending: response.data.totalPending || 0
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Lấy danh sách khóa học thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy danh sách khóa học thất bại'
      };
    }
  }
  
  async createLecture(courseId, lectureData) {
    try {
      const formData = new FormData();
      formData.append('content', lectureData.content);
      if (lectureData.video) {
        formData.append('video', lectureData.video);
      }
      if (lectureData.attachment) {
        formData.append('attachment', lectureData.attachment);
      }
      
      const url = buildUrl(endpoints.learning.createLecture, { courseId });
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          lecture: response.data.lecture
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Tạo bài giảng thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Tạo bài giảng thất bại'
      };
    }
  }
  
  async updateLecture(courseId, lectureId, lectureData) {
    try {
      const formData = new FormData();
      formData.append('content', lectureData.content);
      if (lectureData.video) {
        formData.append('video', lectureData.video);
      }
      if (lectureData.attachment) {
        formData.append('attachment', lectureData.attachment);
      }
      
      const url = buildUrl(endpoints.learning.updateLecture, { courseId, lectureId });
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          lecture: response.data.lecture
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Cập nhật bài giảng thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật bài giảng thất bại'
      };
    }
  }
  
  async deleteLecture(courseId, lectureId) {
    try {
      const url = buildUrl(endpoints.learning.deleteLecture, { courseId, lectureId });
      const response = await axios.delete(url);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Xóa bài giảng thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Xóa bài giảng thất bại'
      };
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

  async getExamQuestions(courseId, examId, page = 1, limit = 5) {
    try {
      const url = buildUrl(endpoints.learning.getExamQuestions, { courseId, examId });
      const response = await axios.get(url, { 
        params: { 
          page, 
          limit 
        } 
      });
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

  
  async createExam(courseId, examData) {
    try {
      const url = buildUrl(endpoints.learning.createExam, { courseId });
      const response = await axios.post(url, examData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          exam: response.data.exam
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Tạo bài kiểm tra thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Tạo bài kiểm tra thất bại'
      };
    }
  }
  
  async updateExam(courseId, examId, examData) {
    try {
      const url = buildUrl(endpoints.learning.updateExam, { courseId, examId });
      const response = await axios.put(url, examData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          exam: response.data.exam
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Cập nhật bài kiểm tra thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật bài kiểm tra thất bại'
      };
    }
  }
  
  async deleteExam(courseId, examId) {
    try {
      const url = buildUrl(endpoints.learning.deleteExam, { courseId, examId });
      const response = await axios.delete(url);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Xóa bài kiểm tra thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Xóa bài kiểm tra thất bại'
      };
    }
  }
  
  // ==================== QUESTION MANAGEMENT ====================
  
  async createQuestion(courseId, examId, questionData) {
    try {
      const url = buildUrl(endpoints.learning.createQuestion, { courseId, examId });
      const response = await axios.post(url, questionData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          question: response.data.question
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Tạo câu hỏi thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Tạo câu hỏi thất bại'
      };
    }
  }
  
  async updateQuestion(courseId, examId, questionId, questionData) {
    try {
      const url = buildUrl(endpoints.learning.updateQuestion, { courseId, examId, questionId });
      const response = await axios.put(url, questionData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          question: response.data.question
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Cập nhật câu hỏi thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật câu hỏi thất bại'
      };
    }
  }
  
  async deleteQuestion(courseId, examId, questionId) {
    try {
      const url = buildUrl(endpoints.learning.deleteQuestion, { courseId, examId, questionId });
      const response = await axios.delete(url);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Xóa câu hỏi thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Xóa câu hỏi thất bại'
      };
    }
  }
  
  // ==================== ANSWER MANAGEMENT ====================
  
  async createAnswer(courseId, examId, questionId, answerData) {
    try {
      const url = buildUrl(endpoints.learning.createAnswer, { courseId, examId, questionId });
      const response = await axios.post(url, answerData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          answer: response.data.answer
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Tạo đáp án thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Tạo đáp án thất bại'
      };
    }
  }
  
  async updateAnswer(courseId, examId, questionId, answerId, answerData) {
    try {
      const url = buildUrl(endpoints.learning.updateAnswer, { courseId, examId, questionId, answerId });
      const response = await axios.put(url, answerData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          answer: response.data.answer
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Cập nhật đáp án thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật đáp án thất bại'
      };
    }
  }
  
  async deleteAnswer(courseId, examId, questionId, answerId) {
    try {
      const url = buildUrl(endpoints.learning.deleteAnswer, { courseId, examId, questionId, answerId });
      const response = await axios.delete(url);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Xóa đáp án thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Xóa đáp án thất bại'
      };
    }
  }
}

export const learningService = new LearningService();
