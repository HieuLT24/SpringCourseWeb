import axios from "axios";

export const BASE_URL = "https://closely-tough-glowworm.ngrok-free.app/CourseWeb/api/";

export const endpoints = {
    'auth': {
        'login': 'auth/login',
        'logout': 'auth/logout',
        'refresh': 'auth/refresh',
        'forgotPassword': 'auth/forgot-password',
        'resetPassword': 'auth/reset-password'
    },

    'users': {
        'register': 'users/register',
        'getAll': 'users',
        'getById': 'users/{id}',
        'getCurrent': 'users/me',
        'updateProfile': 'users/me',
        'update': 'users/{id}',
        'changePassword': 'users/me',
        'delete': 'users/{id}'
    },

    'courses': {
        'getAll': 'courses',
        'getById': 'courses/{courseId}',
        'getCategories': 'categories',
        'getListCategories': 'courses/categories',
        'create': 'courses/create',
        'getTeacherCourses': 'courses/teacher/my-courses'
    },

    'enrollments': {
        'enroll': 'courses/{courseId}/enrollments'
    },

    'payments': {
        'process': 'payment/process',
        'checkStatus': 'payment/status/{transactionId}',
        'momoCallback': 'payment/callback/momo',
        'momoReturn': 'payment/callback/momo/guest',
        'vnpayCallback': 'payment/callback/vnpay'
    },

    'learning': {
        'dashboard': 'learning/course/{courseId}',
        'getLectures': 'learning/course/{courseId}/lectures',
        'getExams': 'learning/course/{courseId}/exams',
        'getExamQuestions': 'learning/course/{courseId}/exam/{examId}/questions',
        'viewLecture': 'learning/course/{courseId}/lecture/{lectureId}',
        'takeExam': 'learning/course/{courseId}/exam/{examId}',
        'submitExam': 'learning/course/{courseId}/exam/{examId}/submit',
        'getForum': 'learning/course/{courseId}/forum',
        'getPosts': 'learning/course/{courseId}/forum/posts',
        'createPost': 'learning/course/{courseId}/forum/post',
        'getPost': 'learning/course/{courseId}/forum/post/{postId}',
        'updatePost': 'learning/course/{courseId}/forum/post/{postId}',
        'deletePost': 'learning/course/{courseId}/forum/post/{postId}',
        'createComment': 'learning/course/{courseId}/forum/post/{postId}/comments',
        'updateComment': 'learning/course/{courseId}/forum/post/{postId}/comments/{commentId}',
        'deleteComment': 'learning/course/{courseId}/forum/post/{postId}/comments/{commentId}',
        'createLecture': 'learning/course/{courseId}/lectures',
        'updateLecture': 'learning/course/{courseId}/lecture/{lectureId}',
        'deleteLecture': 'learning/course/{courseId}/lecture/{lectureId}',
        // Exam Management
        'createExam': 'learning/course/{courseId}/exams',
        'updateExam': 'learning/course/{courseId}/exam/{examId}',
        'deleteExam': 'learning/course/{courseId}/exam/{examId}',
        // Question Management
        'createQuestion': 'learning/course/{courseId}/exam/{examId}/questions',
        'updateQuestion': 'learning/course/{courseId}/exam/{examId}/question/{questionId}',
        'deleteQuestion': 'learning/course/{courseId}/exam/{examId}/question/{questionId}',
        // Answer Management
        'createAnswer': 'learning/course/{courseId}/exam/{examId}/question/{questionId}/answers',
        'updateAnswer': 'learning/course/{courseId}/exam/{examId}/question/{questionId}/answer/{answerId}',
        'deleteAnswer': 'learning/course/{courseId}/exam/{examId}/question/{questionId}/answer/{answerId}'
    },

    'admin': {
        'dashboard': 'admin/dashboard',
        'getCategories': 'admin/categories',
        'listCourses': 'admin/courses',
        'getPendingCourses': 'admin/courses/pending',
        'getCourse': 'admin/courses/{courseId}',
        'saveCourse': 'admin/courses',
        'updateCourse': 'admin/courses/{courseId}',
        'deleteCourse': 'admin/courses/{courseId}',
        'getStats': 'admin/stats',
        'getRevenueByCourse': 'admin/revenue-by-course',
        'getTotalRevenue': 'admin/total-revenue',
        'getRevenueByMonth': 'admin/revenue-by-month'
    },

};

export const buildUrl = (endpoint, params = {}) => {
    let url = endpoint;
    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });
    return url;
};

export const getFullUrl = (endpoint, params = {}) => {
    const builtEndpoint = buildUrl(endpoint, params);
    return BASE_URL + builtEndpoint;
};

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token"); // hoặc Redux store
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;