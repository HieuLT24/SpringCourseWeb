import { api } from './api';

export const userService = {
    // Đăng ký tài khoản mới
    register: async (userData) => {
        return await api.post('/users/register', userData);
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        return await api.get('/users/current');
    },

    // Lấy thông tin user theo ID
    getUserById: async (userId) => {
        return await api.get(`/users/${userId}`);
    },

    // Cập nhật thông tin profile
    updateProfile: async (userData) => {
        return await api.put('/users/profile', userData);
    },

    // Đổi mật khẩu
    changePassword: async (oldPassword, newPassword, confirmPassword) => {
        return await api.put('/users/change-password', {
            oldPassword,
            newPassword,
            confirmPassword
        });
    },

    // Xóa tài khoản
    deleteAccount: async () => {
        return await api.delete('/users/delete');
    }
};
