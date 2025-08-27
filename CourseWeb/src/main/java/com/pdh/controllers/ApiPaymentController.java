package com.pdh.controllers;
import com.pdh.pojo.*;
import com.pdh.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import static com.pdh.utils.HmacUtil.hmacSHA512;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class ApiPaymentController {
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


    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentRequest,
                                            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        if (authentication == null || !authentication.isAuthenticated()) {
            response.put("success", false);
            response.put("message", "Bạn chưa đăng nhập");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            User user = userService.getUserByUsername(authentication.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Người dùng không tồn tại"
                ));
            }

            Integer courseId = (Integer) paymentRequest.get("courseId");
            String paymentMethod = (String) paymentRequest.get("paymentMethod");

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "success", false,
                        "message", "Khóa học không tồn tại"
                ));
            }

            if (enrollmentService.isUserEnrolled(user.getId(), courseId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                        "success", false,
                        "message", "Bạn đã đăng ký khóa học này rồi"
                ));
            }

            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(user);
            enrollment.setCourseId(course);
            enrollment.setEnrollAt(new Date());
            enrollment.setStatus("PENDING");
            Enrollment savedEnrollment = enrollmentService.createEnrollment(enrollment);

            Payment payment = new Payment();
            payment.setEnrollmentId(savedEnrollment);
            payment.setAmount(course.getPrice());
            payment.setMethod(paymentMethod);
            payment.setTimeStamp(new Date());

            Payment savedPayment = paymentService.createPayment(payment);

            String paymentUrl = null;
            if ("MOMO".equalsIgnoreCase(paymentMethod)) {
                paymentUrl = paymentService.createMoMoPaymentUrl(savedPayment.getId(), course.getPrice());
            } else if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
                paymentUrl = paymentService.createVNPayPaymentUrl(savedPayment.getId(), course.getPrice());
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Phương thức thanh toán không hợp lệ"
                ));
            }

            savedPayment.setQrCodeData(paymentUrl);
            paymentService.updatePayment(savedPayment);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Tạo thanh toán thành công",
                    "paymentUrl", paymentUrl,
                    "paymentId", savedPayment.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/status/{transactionId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable String transactionId) {
        try {
            boolean isSuccess = paymentService.verifyPayment(transactionId);

            return ResponseEntity.ok(Map.of(
                    "success", isSuccess,
                    "transactionId", transactionId,
                    "message", isSuccess ? "Thanh toán đã được xác nhận"
                                         : "Thanh toán chưa hoàn tất hoặc không tồn tại"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Lỗi kiểm tra trạng thái: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/callback/momo")
    public ResponseEntity<?> momoCallback(@RequestBody Map<String, String> callbackData) {
        try {
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

            return ResponseEntity.ok("IPN received");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }

    @GetMapping("/callback/momo/guest")
    public ResponseEntity<?> momoReturn(@RequestParam Map<String, String> params) {
        String orderId = params.get("orderId");
        String resultCode = params.get("resultCode");

        return ResponseEntity.ok(Map.of(
                "success", "0".equals(resultCode),
                "orderId", orderId,
                "message", "0".equals(resultCode)
                        ? "Thanh toán MoMo thành công"
                        : "Thanh toán MoMo thất bại"
        ));
    }
    @RequestMapping(value = "/callback/vnpay", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> vnpayCallback(@RequestParam Map<String, String> callbackData) {
        try {
            if (!verifyVNPaySignature(callbackData)) {
                return ResponseEntity.badRequest().body("INVALID_SIGNATURE");
            }

            String vnp_TxnRef = callbackData.get("vnp_TxnRef");
            String vnp_ResponseCode = callbackData.get("vnp_ResponseCode");
            int paymentId = Integer.parseInt(vnp_TxnRef.split("_")[0]);

            Payment payment = paymentService.getPaymentById(paymentId);
            if (payment != null) {
                if ("00".equals(vnp_ResponseCode)) {
                    payment.setStatus("SUCCESS");
                    if (payment.getEnrollmentId() != null) {
                        Enrollment enrollment = payment.getEnrollmentId();
                        enrollment.setStatus("ACTIVE");
                        enrollmentService.updateEnrollment(enrollment);
                    }
                } else {
                    payment.setStatus("FAILED");
                }
                paymentService.updatePayment(payment);
            }

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
        }
    }


    private boolean verifyVNPaySignature(Map<String, String> callbackData) {
        try {
            String vnp_SecureHash = callbackData.get("vnp_SecureHash");
            if (vnp_SecureHash == null) return false;

            Map<String, String> fields = new HashMap<>(callbackData);
            fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");

            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String key = fieldNames.get(i);
                String value = fields.get(key);
                if (value != null && !value.isEmpty()) {
                    sb.append(key).append("=")
                      .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    if (i < fieldNames.size() - 1) {
                        sb.append("&");
                    }
                }
            }

            String signValue = hmacSHA512(sb.toString(), vnpayHashSecret);
            return signValue.equalsIgnoreCase(vnp_SecureHash);

        } catch (Exception e) {
            return false;
        }
    }
}
