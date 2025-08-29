package com.pdh.controllers;

import com.pdh.dto.auth.LoginRequest;
import com.pdh.dto.auth.TokenRefreshRequest;
import com.pdh.pojo.User;
import com.pdh.repositories.UserRepository;
import com.pdh.services.AuthService;
import com.pdh.utils.JwtUtil;

import org.springframework.security.core.Authentication;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class ApiAuthController {
    @Autowired private UserRepository userRepository;
    @Autowired private JavaMailSender mailSender;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication, HttpServletRequest request) {
        String username = null;
        if (authentication != null) {
            username = authentication.getName();
        }
        if (username == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                username = jwtUtil.validateToken(token);
            }
        }
        if (username != null) {
            authService.logout(username);
            return ResponseEntity.ok("Đăng xuất thành công");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không xác định được người dùng");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        try {
            User user = userRepository.getUserByEmail(email);

            if (user != null) {
                String token = jwtUtil.generateToken(email);
                String resetUrl = "http://localhost:3000/reset-password?token=" + token; 
                // React frontend sẽ dùng link này

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(email);
                mailMessage.setSubject("Đặt lại mật khẩu - CourseWeb");
                mailMessage.setText("Xin chào " + user.getName() + ",\n\n" +
                        "Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link sau để đặt lại mật khẩu:\n\n" +
                        resetUrl + "\n\n" +
                        "Link này sẽ hết hạn sau 1 giờ.\n\n" +
                        "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                        "Trân trọng,\n" +
                        "Đội ngũ CourseWeb");

                mailSender.send(mailMessage);

                return ResponseEntity.ok(Map.of("message", "Link khôi phục mật khẩu đã được gửi đến email của bạn!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Email không tồn tại trong hệ thống!"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau!"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("token") String token,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword) {
        try {
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Mật khẩu phải có ít nhất 6 ký tự!"));
            }
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Mật khẩu xác nhận không khớp!"));
            }

            String email = jwtUtil.validateToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Link khôi phục không hợp lệ hoặc đã hết hạn."));
            }

            User user = userRepository.getUserByEmail(email);
            if (user != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                user.setPassword(passwordEncoder.encode(password));
                userRepository.createOrUpdateUser(user);

                return ResponseEntity.ok(Map.of("message", "Mật khẩu đã được đặt lại thành công!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy tài khoản!"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi đặt lại mật khẩu!"));
        }
    }
}


