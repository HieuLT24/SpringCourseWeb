import { api } from './api';

export const courseService = {
    // Lấy danh sách tất cả khóa học
    getAllCourses: async () => {
        return await api.get('/courses');
    },

    // Lấy danh sách khóa học theo category
    getCoursesByCategory: async (categoryId) => {
        return await api.get(`/courses?categoryId=${categoryId}`);
    },

    // Lấy chi tiết khóa học
    getCourseById: async (courseId) => {
        return await api.get(`/learning/course/${courseId}`);
    },

    // Lấy danh sách bài giảng của khóa học
    getCourseLectures: async (courseId) => {
        return await api.get(`/learning/course/${courseId}/lectures`);
    },

    // Lấy danh sách bài thi của khóa học
    getCourseExams: async (courseId) => {
        return await api.get(`/learning/course/${courseId}/exams`);
    },

    // Lấy chi tiết bài giảng
    getLectureById: async (courseId, lectureId) => {
        return await api.get(`/learning/course/${courseId}/lecture/${lectureId}`);
    },

    // Lấy chi tiết bài thi
    getExamById: async (courseId, examId) => {
        return await api.get(`/learning/course/${courseId}/exam/${examId}`);
    },

    // Nộp bài thi
    submitExam: async (courseId, examId, answers) => {
        return await api.post(`/learning/course/${courseId}/exam/${examId}/submit`, { answers });
    },

    // Lấy danh sách categories
    getCategories: async () => {
        return await api.get('/categories');
    }
};
