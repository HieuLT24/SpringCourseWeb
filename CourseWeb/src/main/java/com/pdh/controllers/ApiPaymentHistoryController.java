package com.pdh.controllers;

import com.pdh.dto.payment.CourseHistoryDto;
import com.pdh.services.PaymentServices;
import com.pdh.services.UserServices;
import com.pdh.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-history")
@CrossOrigin
public class ApiPaymentHistoryController {

    @Autowired
    private PaymentServices paymentServices;

    @Autowired
    private UserServices userServices;

    @GetMapping("/courses")
    public ResponseEntity<?> getCourseHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập");
        }

        try {
            User user = userServices.getUserByUsername(authentication.getName());
            if (user == null) {
                return ResponseEntity.status(401).body("Không tìm thấy người dùng");
            }

            List<CourseHistoryDto> courseHistory = paymentServices.getCourseHistoryByUserId(user.getId());
            
            return ResponseEntity.ok(courseHistory);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}
