package com.pdh.controllers;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.pdh.pojo.User;
import com.pdh.repositories.UserRepository;
import com.pdh.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Controller
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/forgot-password")
    public String showForgotPasswordForm() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam("email") String email, 
                                RedirectAttributes redirectAttributes) {
        try {
            User user = userRepository.getUserByEmail(email);

            if (user != null) {
                String token = jwtUtil.generateToken(email);
                String resetUrl = "http://localhost:8080/CourseWeb/reset-password?token=" + token;

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
                
                redirectAttributes.addFlashAttribute("successMessage", 
                    "Link khôi phục mật khẩu đã được gửi đến email của bạn!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", 
                    "Email không tồn tại trong hệ thống!");
            }

            return "redirect:/forgot-password";
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau!");
            return "redirect:/forgot-password";
        }
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token, Model model) {
        try {
            String email = jwtUtil.validateToken(token);
            if (email == null) {
                model.addAttribute("errorMessage", "Link khôi phục không hợp lệ hoặc đã hết hạn.");
                return "error";
            }
            model.addAttribute("token", token);
            model.addAttribute("email", email);
            return "reset-password-form";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Link khôi phục không hợp lệ hoặc đã hết hạn.");
            return "error";
        }
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam("token") String token,
                               @RequestParam("password") String password,
                               @RequestParam("confirmPassword") String confirmPassword,
                               Model model,
                               RedirectAttributes redirectAttributes) {
        try {
            // Kiểm tra mật khẩu xác nhận
            if (!password.equals(confirmPassword)) {
                model.addAttribute("errorMessage", "Mật khẩu xác nhận không khớp!");
                model.addAttribute("token", token);
                return "reset-password-form";
            }

            String email = jwtUtil.validateToken(token);
            if (email == null) {
                model.addAttribute("errorMessage", "Link khôi phục không hợp lệ hoặc đã hết hạn.");
                return "error";
            }

            User user = userRepository.getUserByEmail(email);
            if (user != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                user.setPassword(passwordEncoder.encode(password));
                userRepository.createOrUpdateUser(user);
                
                redirectAttributes.addFlashAttribute("successMessage", 
                    "Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập với mật khẩu mới.");
                return "redirect:/login";
            } else {
                model.addAttribute("errorMessage", "Không tìm thấy tài khoản!");
                return "error";
            }
            
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Có lỗi xảy ra khi đặt lại mật khẩu!");
            return "error";
        }
    }
}
