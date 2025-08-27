import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      if (response.success) {
        authService.saveAuthData(response);
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Có lỗi xảy ra khi đăng nhập' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      authService.clearAuthData();
      setIsAuthenticated(false);
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Có lỗi xảy ra khi đăng xuất' };
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await authService.refreshToken(refreshToken);
      
      if (response.success) {
        authService.saveAuthData(response);
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        return { success: true };
      } else {
        // Refresh token expired, logout user
        await logout();
        return { success: false, message: 'Phiên đăng nhập đã hết hạn' };
      }
    } catch (error) {
      // Refresh token invalid, logout user
      await logout();
      return { success: false, message: 'Phiên đăng nhập không hợp lệ' };
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    login,
    logout,
    refreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
