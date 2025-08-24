/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;
import com.pdh.pojo.Payment;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.PaymentServices;
import com.pdh.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author duchi
 */
@RestController
@RequestMapping("/api/payment")

public class PaymentController {
    
    @Autowired
    private PaymentServices paymentService;
    
    @Autowired
    private EnrollmentServices enrollmentService;
    
    @Autowired
    private CourseServices courseService;
    
    @Autowired
    private UserServices userService;
    
    /**
     * API xử lý thanh toán khóa học
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(
            @RequestBody Map<String, Object> paymentRequest,
            Authentication authentication) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Lấy thông tin user đang đăng nhập
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Lấy thông tin từ request
            Integer courseId = (Integer) paymentRequest.get("courseId");
            String paymentMethod = (String) paymentRequest.get("paymentMethod");
            
            // Lấy thông tin khóa học
            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                response.put("success", false);
                response.put("message", "Khóa học không tồn tại");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Kiểm tra xem user đã đăng ký khóa học này chưa
            if (enrollmentService.isUserEnrolled(user.getId(), courseId)) {
                response.put("success", false);
                response.put("message", "Bạn đã đăng ký khóa học này rồi");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            
            // Tạo enrollment mới với trạng thái PENDING
            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(user);
            enrollment.setCourseId(course);
            enrollment.setEnrollAt(new Date());
            enrollment.setStatus("PENDING");
            
            Enrollment savedEnrollment = enrollmentService.createEnrollment(enrollment);
            
            // Tạo payment
            Payment payment = new Payment();
            payment.setEnrollmentId(savedEnrollment);
            payment.setAmount(course.getPrice());
            payment.setMethod(paymentMethod);
            payment.setTimeStamp(new Date());

            
            if ("MOMO".equals(paymentMethod)) {
                // Xử lý thanh toán MoMo
                payment.setMethod("MOMO");
                Payment savedPayment = paymentService.createPayment(payment);
                
                // Tạo URL thanh toán MoMo
                String momoPaymentUrl = paymentService.createMoMoPaymentUrl(savedPayment.getId(), course.getPrice());
                savedPayment.setQrCodeData(momoPaymentUrl);
                paymentService.updatePayment(savedPayment);
                
                response.put("success", true);
                response.put("message", "Đã tạo URL thanh toán MoMo!");
                response.put("paymentUrl", momoPaymentUrl);
                
            } else if ("VNPAY".equals(paymentMethod)) {
                // Xử lý thanh toán VNPay
                payment.setMethod("VNPAY");
                Payment savedPayment = paymentService.createPayment(payment);
                
                // Tạo URL thanh toán VNPay
                String vnpayPaymentUrl = paymentService.createVNPayPaymentUrl(savedPayment.getId(), course.getPrice());
                savedPayment.setQrCodeData(vnpayPaymentUrl);
                paymentService.updatePayment(savedPayment);
                
                response.put("success", true);
                response.put("message", "Đã tạo URL thanh toán VNPay!");
                response.put("paymentUrl", vnpayPaymentUrl);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * API kiểm tra trạng thái thanh toán
     */
    @GetMapping("/status/{transactionId}")
    public ResponseEntity<Map<String, Object>> checkPaymentStatus(
            @PathVariable String transactionId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean isSuccess = paymentService.verifyPayment(transactionId);
            
            response.put("success", isSuccess);
            response.put("transactionId", transactionId);
            
            if (isSuccess) {
                response.put("message", "Thanh toán đã được xác nhận");
            } else {
                response.put("message", "Thanh toán chưa hoàn tất hoặc không tồn tại");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi kiểm tra trạng thái: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * API callback từ MoMo (webhook)
     */
    @PostMapping("/callback/momo")
    public ResponseEntity<String> momoCallback(
            @RequestBody Map<String, String> callbackData) {
        
        try {
            
            if (!verifyMoMoSignature(callbackData)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_SIGNATURE");
            }
            System.out.println("MoMo Callback data: " + callbackData);
            System.out.println(new ObjectMapper().writeValueAsString(callbackData));

            // Xử lý callback data
            String orderId = callbackData.get("orderId");
            String resultCode = callbackData.get("resultCode");
            String transId = callbackData.get("transId");
            
            int paymentId = Integer.parseInt(orderId.split("_")[0]);

            Payment payment = paymentService.getPaymentById(paymentId);
            if (payment != null) {
                payment.setTransactionId(transId);

                if ("0".equals(resultCode)) {
                    payment.setStatus("SUCCESS");
                    Enrollment enrollment = payment.getEnrollmentId();
                    enrollment.setStatus("ACTIVE");
                    enrollmentService.updateEnrollment(enrollment);
                } else {
                    payment.setStatus("FAILED");
                }

                paymentService.updatePayment(payment);
            }
            
            System.out.println("MoMo Callback data: " + callbackData);
            return ResponseEntity.ok("IPN received");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }
    
    @GetMapping("/callback/momo/guest")
    public ResponseEntity<String> momoReturn(@RequestParam Map<String, String> params) {
        String orderId = params.get("orderId");
        String resultCode = params.get("resultCode");
    
        if ("0".equals(resultCode)) {
            return ResponseEntity.ok("Thanh toán MoMo thành công cho đơn hàng: " + orderId);
        } else {
            return ResponseEntity.ok("Thanh toán MoMo thất bại cho đơn hàng: " + orderId);
        }
    }

    /**
     * API callback từ VNPay (webhook)
     */
    @PostMapping("/callback/vnpay")
    public ResponseEntity<String> vnpayCallback(
            @RequestParam Map<String, String> callbackData) {
        
        try {
            // Verify signature từ VNPay (cần implement đúng thuật toán)
            if (!verifyVNPaySignature(callbackData)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_SIGNATURE");
            }
            
            // Xử lý callback data
            String vnp_TxnRef = callbackData.get("vnp_TxnRef");
            String vnp_ResponseCode = callbackData.get("vnp_ResponseCode");
            String vnp_Amount = callbackData.get("vnp_Amount");
            String vnp_TransactionNo = callbackData.get("vnp_TransactionNo");
            
            // Cập nhật trạng thái payment
            if ("00".equals(vnp_ResponseCode)) {
                // Thanh toán thành công
                updatePaymentStatusByTransactionId(vnp_TxnRef, "SUCCESS");
                updateEnrollmentStatusByTransactionId(vnp_TxnRef, "ACTIVE");
            } else {
                // Thanh toán thất bại
                updatePaymentStatusByTransactionId(vnp_TxnRef, "FAILED");
            }
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }
    
    /**
     * Verify signature từ MoMo
     */
    private boolean verifyMoMoSignature(Map<String, String> callbackData) {
        // TODO: Implement đúng thuật toán verify signature của MoMo
        // Đây chỉ là placeholder
        return true;
    }
    
    /**
     * Verify signature từ VNPay
     */
    private boolean verifyVNPaySignature(Map<String, String> callbackData) {
        // TODO: Implement đúng thuật toán verify signature của VNPay
        // Đây chỉ là placeholder
        return true;
    }
    
    /**
     * Cập nhật trạng thái payment theo transaction ID
     */
    private void updatePaymentStatusByTransactionId(String transactionId, String status) {
        try {
            Payment payment = paymentService.getPaymentByTransactionId(transactionId);
            if (payment != null) {
                paymentService.updatePaymentStatus(payment.getId(), status);
            }
        } catch (Exception e) {
            // Log error
        }
    }
    
    /**
     * Cập nhật trạng thái enrollment theo transaction ID
     */
    private void updateEnrollmentStatusByTransactionId(String transactionId, String status) {
        try {
            Payment payment = paymentService.getPaymentByTransactionId(transactionId);
            if (payment != null && payment.getEnrollmentId() != null) {
                Enrollment enrollment = payment.getEnrollmentId();
                enrollment.setStatus(status);
                enrollmentService.updateEnrollment(enrollment);
            }
        } catch (Exception e) {
            // Log error
        }
    }  
    
}
