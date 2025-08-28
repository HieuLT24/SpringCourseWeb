import axios from '../configs/Apis';
import { endpoints, buildUrl } from '../configs/Apis';

class UserService {
  async register(userData) {
    try {
      const response = await axios.post(endpoints.users.register, {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name
      });
      return { success: true, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Đăng ký thất bại' 
      };
    }
  }

  async getAllUsers() {
    try {
      const response = await axios.get(endpoints.users.getAll);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const url = buildUrl(endpoints.users.getById, { id });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(endpoints.users.getCurrent);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await axios.put(endpoints.users.updateProfile, userData);
      return { success: true, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Cập nhật thất bại' 
      };
    }
  }

  async changePassword(oldPassword, newPassword, confirmPassword) {
    try {
      const response = await axios.put(endpoints.users.changePassword, {
        oldPassword,
        newPassword,
        confirmPassword
      });
      return { success: true, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Đổi mật khẩu thất bại' 
      };
    }
  }

  async deleteUser(id) {
    try {
      const url = buildUrl(endpoints.users.delete, { id });
      const response = await axios.delete(url);
      return { success: true, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Xóa user thất bại' 
      };
    }
  }
}

export const userService = new UserService();
