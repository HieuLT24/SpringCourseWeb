import axios from '../configs/Apis';
import { endpoints } from '../configs/Apis';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(endpoints.auth.login, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axios.post(endpoints.auth.logout);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(endpoints.auth.refresh, {
        refreshToken
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await axios.post(endpoints.auth.forgotPassword, null, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, password, confirmPassword) {
    try {
      const response = await axios.post(endpoints.auth.resetPassword, null, {
        params: { token, password, confirmPassword }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Local storage methods
  saveAuthData(data) {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Setup axios interceptor for authentication
  setupAuthInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config || {};
        const isAuthEndpoint = originalRequest.url?.includes('auth/refresh') || originalRequest.url?.includes('auth/login');
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            try {
              const resp = await this.refreshToken(refreshToken);
              if (!resp?.accessToken) throw new Error('No access token');
              this.saveAuthData(resp);
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${resp.accessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              this.clearAuthData();
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();
authService.setupAuthInterceptor();
