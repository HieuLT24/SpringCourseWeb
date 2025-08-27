package com.pdh.services;

import com.pdh.dto.auth.LoginRequest;
import com.pdh.dto.auth.TokenRefreshRequest;
import java.util.Map;

public interface AuthService {
    Map<String, Object> login(LoginRequest request);
    Map<String, Object> logout(String username);
    Map<String, Object> refreshToken(TokenRefreshRequest request);
}
