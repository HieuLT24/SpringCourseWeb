package com.pdh.controllers;

import org.springframework.beans.factory.annotation.Value;
import com.pdh.dto.auth.LoginRequest;
import com.pdh.dto.auth.TokenRefreshRequest;
import com.pdh.pojo.User;
import com.pdh.repositories.UserRepository;
import com.pdh.services.AuthService;
import com.pdh.services.UserServices;
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
import java.util.HashMap;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@PropertySource("classpath:google.properties")
public class ApiAuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthService authService;
    @Value("${google.clientId}")
    private String GOOGLE_CLIENT_ID;
    @Autowired
    private UserServices userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/login/google")
    public ResponseEntity<?> verifyGoogleToken(@RequestBody Map<String, String> body) {
        String idTokenString = body.get("token");
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString;
            Map<?, ?> tokenInfo = restTemplate.getForObject(url, Map.class);
            if (tokenInfo != null && GOOGLE_CLIENT_ID.equals(String.valueOf(tokenInfo.get("aud")))) {
                String email = String.valueOf(tokenInfo.get("email"));
                String name = tokenInfo.get("name") != null ? String.valueOf(tokenInfo.get("name")) : email;
                String pictureUrl = tokenInfo.get("picture") != null ? String.valueOf(tokenInfo.get("picture")) : null;

                User user = null;
                try {
                    user = userService.getUserByEmail(email);
                } catch (Exception ex) {
                    user = null;
                }
                if (user == null) {
                    user = userService.createUserFromGoogle(email, name, pictureUrl);
                }

                String accessToken = jwtUtil.generateToken(user.getUsername());
                String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

                Map<String, Object> response = new HashMap<>();
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
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/public/google-client-id")
    public ResponseEntity<?> getGoogleClientId() {
        Map<String, String> res = new HashMap<>();
        res.put("clientId", GOOGLE_CLIENT_ID);
        return ResponseEntity.ok(res);
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

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(email);
                mailMessage.setSubject("Đặt lại mật khẩu - CourseWeb");
                mailMessage.setText("Xin chào " + user.getName() + ",\n\n"
                        + "Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link sau để đặt lại mật khẩu:\n\n"
                        + resetUrl + "\n\n"
                        + "Link này sẽ hết hạn sau 1 giờ.\n\n"
                        + "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n"
                        + "Trân trọng,\n"
                        + "Đội ngũ CourseWeb");

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
