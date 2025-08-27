package com.pdh.services.impl;

import com.pdh.dto.auth.LoginRequest;
import com.pdh.dto.auth.TokenRefreshRequest;
import com.pdh.pojo.User;
import com.pdh.services.AuthService;
import com.pdh.services.UserServices;
import com.pdh.utils.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private UserServices userServices;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userServices.getUserByUsername(request.getUsername());
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "Tên đăng nhập không tồn tại");
                return response;
            }
            
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "Mật khẩu không đúng");
                return response;
            }
            
            // Tạo JWT token
            String accessToken = jwtUtil.generateToken(user.getUsername());
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
            
            response.put("success", true);
            response.put("message", "Đăng nhập thành công");
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole()
            ));
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
        }
        
        return response;
    }
    
    @Override
    public Map<String, Object> logout(String username) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Có thể implement blacklist token ở đây
            // Hiện tại chỉ trả về success
            response.put("success", true);
            response.put("message", "Đăng xuất thành công");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
        }
        
        return response;
    }
    
    @Override
    public Map<String, Object> refreshToken(TokenRefreshRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = jwtUtil.validateRefreshToken(request.getRefreshToken());
            
            if (username == null) {
                response.put("success", false);
                response.put("message", "Refresh token không hợp lệ hoặc đã hết hạn");
                return response;
            }
            
            User user = userServices.getUserByUsername(username);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại");
                return response;
            }
            
            // Tạo token mới
            String newAccessToken = jwtUtil.generateToken(username);
            String newRefreshToken = jwtUtil.generateRefreshToken(username);
            
            response.put("success", true);
            response.put("message", "Làm mới token thành công");
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", newRefreshToken);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
        }
        
        return response;
    }
}
