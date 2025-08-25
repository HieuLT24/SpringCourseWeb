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
import static com.pdh.utils.HmacUtil.hmacSHA512;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.ArrayList;
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

    @Value("${vnpay.hashSecret}")
    private String vnpayHashSecret;

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
    @RequestMapping(value = "/callback/vnpay", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<String> vnpayCallback(
            @RequestParam Map<String, String> callbackData) {

        try {
            // Verify signature từ VNPay
            if (!verifyVNPaySignature(callbackData)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_SIGNATURE");
            }

            // Xử lý callback data
            String vnp_TxnRef = callbackData.get("vnp_TxnRef");
            String vnp_ResponseCode = callbackData.get("vnp_ResponseCode");
            int paymentId = Integer.parseInt(vnp_TxnRef.split("_")[0]);
            // Cập nhật trực tiếp trạng thái payment và enrollment
            Payment payment = paymentService.getPaymentById(paymentId);
            System.out.println("[VNPay][CALLBACK] found payment by txnRef=" + vnp_TxnRef + ": " + (payment != null));
            if (payment != null) {
                if ("00".equals(vnp_ResponseCode)) {
                    payment.setStatus("SUCCESS");
                    paymentService.updatePayment(payment);
                    if (payment.getEnrollmentId() != null) {
                        Enrollment enrollment = payment.getEnrollmentId();
                        enrollment.setStatus("ACTIVE");
                        enrollmentService.updateEnrollment(enrollment);
                    }
                } else {
                    payment.setStatus("FAILED");
                    paymentService.updatePayment(payment);
                }
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
        
        return true;
    }

    /**
     * Verify signature từ VNPay
     */
    private boolean verifyVNPaySignature(Map<String, String> callbackData) {
        try {
            String vnp_SecureHash = callbackData.get("vnp_SecureHash");
            if (vnp_SecureHash == null)
                return false;

            // Bỏ SecureHash và SecureHashType
            Map<String, String> fields = new HashMap<>(callbackData);
            fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");

            // Sort theo key (VNPay yêu cầu thứ tự alphabet)
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            // Build chuỗi hash theo mẫu VNPay: key=value, chỉ encode value (US_ASCII)
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String key = fieldNames.get(i);
                String value = fields.get(key);
                if (value != null && value.length() > 0) {
                    String encoded = java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.US_ASCII.toString());
                    sb.append(key).append("=").append(encoded);
                    if (i < fieldNames.size() - 1) {
                        sb.append("&");
                    }
                }
            }

            // Hash với secret key
            String signValue = hmacSHA512(sb.toString(), vnpayHashSecret);

            return signValue.equalsIgnoreCase(vnp_SecureHash);
        } catch (Exception e) {
            
            return false;
        }
    }


}
