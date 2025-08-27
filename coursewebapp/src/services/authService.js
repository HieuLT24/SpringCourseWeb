import { api } from './api';

export const authService = {
    // Đăng nhập
    login: async (username, password) => {
        return await api.post('/auth/login', { username, password });
    },

    // Đăng xuất
    logout: async () => {
        return await api.post('/auth/logout');
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        return await api.post('/auth/refresh', { refreshToken });
    },

    // Quên mật khẩu
    forgotPassword: async (email) => {
        const formData = new FormData();
        formData.append('email', email);
        
        const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    },

    // Reset mật khẩu
    resetPassword: async (token, password, confirmPassword) => {
        const formData = new FormData();
        formData.append('token', token);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        
        const response = await fetch('http://localhost:8080/api/auth/reset-password', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    },

    // Kiểm tra trạng thái đăng nhập
    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        return !!token;
    },

    // Lấy thông tin user từ token
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Lưu thông tin đăng nhập
    saveAuthData: (authData) => {
        if (authData.accessToken) {
            localStorage.setItem('accessToken', authData.accessToken);
        }
        if (authData.refreshToken) {
            localStorage.setItem('refreshToken', authData.refreshToken);
        }
        if (authData.user) {
            localStorage.setItem('user', JSON.stringify(authData.user));
        }
    },

    // Xóa thông tin đăng nhập
    clearAuthData: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
};
