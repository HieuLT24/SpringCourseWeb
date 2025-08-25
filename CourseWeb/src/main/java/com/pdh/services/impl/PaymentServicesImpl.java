/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.Payment;
import com.pdh.repositories.PaymentRepository;
import com.pdh.services.PaymentServices;
import com.pdh.utils.HmacUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 *
 * @author duchi
 */
@Service
@Transactional
@PropertySource("classpath:payment-config.properties")
public class PaymentServicesImpl implements PaymentServices {
    @Value("${momo.accessKey}")
    private String momoAccessKey;

    @Value("${momo.secretKey}")
    private String momoSecretKey;

    @Value("${momo.redirectUrl}")
    private String momoRedirectUrl;

    @Value("${momo.ipnUrl}")
    private String momoIpnUrl;

    @Value("${vnpay.tmnCode}")
    private String vnpayTmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnpayHashSecret;

    @Value("${vnpay.url}")
    private String vnpayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnpayReturnUrl;

    @Autowired
    private PaymentRepository paymentRepository;


    @Override
    @Transactional
    public Payment processPayment(Payment payment) {
        try {
            payment.setTransactionId(generateTransactionId());
            payment.setTimeStamp(new Date());
            payment.setStatus("PROCESSING");

            Payment savedPayment = paymentRepository.createPayment(payment);

            if ("MOMO".equals(payment.getMethod())) {
                // Thanh toán MoMo - tạo URL thanh toán
                String momoUrl = createMoMoPaymentUrl(savedPayment.getId(), payment.getAmount());
                savedPayment.setQrCodeData(momoUrl);
                savedPayment.setStatus("PENDING");
                paymentRepository.updatePayment(savedPayment);

            } else if ("VNPAY".equals(payment.getMethod())) {
                // Thanh toán VNPay - tạo URL thanh toán
                String vnpayUrl = createVNPayPaymentUrl(savedPayment.getId(), payment.getAmount());
                savedPayment.setQrCodeData(vnpayUrl);
                savedPayment.setStatus("PENDING");
                paymentRepository.updatePayment(savedPayment);
            }

            return savedPayment;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý thanh toán: " + e.getMessage());
        }
    }

    @Override
    public Payment createPayment(Payment payment) {
        payment.setTimeStamp(new Date());
        payment.setStatus("PENDING");
        return paymentRepository.createPayment(payment);
    }

    @Override
    public Payment updatePaymentStatus(int paymentId, String status) {
        Payment payment = paymentRepository.getPaymentById(paymentId);
        if (payment != null) {
            payment.setStatus(status);
            return paymentRepository.updatePayment(payment);
        }
        return null;
    }

    @Override
    public Payment getPaymentById(int id) {
        return paymentRepository.getPaymentById(id);
    }

    @Override
    public List<Payment> getPaymentsByEnrollmentId(int enrollmentId) {
        return paymentRepository.getPaymentsByEnrollmentId(enrollmentId);
    }

    @Override
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.getPaymentByTransactionId(transactionId);
    }

    

    @Override
    public boolean verifyPayment(String transactionId) {
        Payment payment = paymentRepository.getPaymentByTransactionId(transactionId);
        return payment != null && "SUCCESS".equals(payment.getStatus());
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    public String createMoMoPaymentUrl(int paymentId, Double amount) {
        try {
            String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
            String partnerCode = "MOMO";
            String accessKey = this.momoAccessKey;
            String secretKey = this.momoSecretKey;

            String orderId = String.valueOf(paymentId + "_" + System.currentTimeMillis());
            String requestId = String.valueOf(System.currentTimeMillis());
            String orderInfo = "Thanh toan khoa hoc " + paymentId;
            String redirectUrl = this.momoRedirectUrl;
            String ipnUrl = this.momoIpnUrl;
            String requestType = "captureWallet";
            String extraData = "";

            // raw signature
            String rawData = "accessKey=" + accessKey +
                    "&amount=" + amount.intValue() +
                    "&extraData=" + extraData +
                    "&ipnUrl=" + ipnUrl +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + partnerCode +
                    "&redirectUrl=" + redirectUrl +
                    "&requestId=" + requestId +
                    "&requestType=" + requestType;

            String signature = HmacUtil.hmacSHA256(rawData, secretKey);

            // Tạo JSON body
            String jsonRequest = "{"
                    + "\"partnerCode\":\"" + partnerCode + "\","
                    + "\"partnerName\":\"MoMoTest\","
                    + "\"storeId\":\"MomoTestStore\","
                    + "\"requestId\":\"" + requestId + "\","
                    + "\"amount\":\"" + amount.intValue() + "\","
                    + "\"orderId\":\"" + orderId + "\","
                    + "\"orderInfo\":\"" + orderInfo + "\","
                    + "\"redirectUrl\":\"" + redirectUrl + "\","
                    + "\"ipnUrl\":\"" + ipnUrl + "\","
                    + "\"lang\":\"vi\","
                    + "\"extraData\":\"" + extraData + "\","
                    + "\"requestType\":\"" + requestType + "\","
                    + "\"signature\":\"" + signature + "\"}";

            // Gửi POST request
            java.net.URL url = new java.net.URL(endpoint);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");

            try (java.io.OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonRequest.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            java.io.BufferedReader br = new java.io.BufferedReader(
                    new java.io.InputStreamReader(conn.getInputStream(), "utf-8"));

            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }

            // Parse JSON để lấy payUrl
            org.json.JSONObject json = new org.json.JSONObject(response.toString());
            return json.getString("payUrl");

        } catch (Exception e) {
            throw new RuntimeException("MoMo create payment error: " + e.getMessage(), e);
        }
    }

    @Override
    public String createVNPayPaymentUrl(int paymentId, Double amount) {
        try {
            String vnp_TmnCode = this.vnpayTmnCode;
            String vnp_HashSecret = this.vnpayHashSecret;
            String vnp_Url = this.vnpayUrl;
            String vnp_ReturnUrl = this.vnpayReturnUrl;

            java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(new java.util.Date());
            String vnp_TxnRef = paymentId + "_" + System.currentTimeMillis();

            Payment payment = paymentRepository.getPaymentById(paymentId);
            if (payment != null) {
                payment.setTransactionId(vnp_TxnRef);
                paymentRepository.updatePayment(payment);
            }

            java.util.Map<String, String> params = new java.util.TreeMap<>();
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnp_TmnCode);
            params.put("vnp_Amount", String.valueOf(amount.longValue() * 100)); // theo xu
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_TxnRef",  vnp_TxnRef);
            params.put("vnp_OrderInfo", "Thanh toan khoa hoc " + paymentId);
            params.put("vnp_OrderType", "other");
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", vnp_ReturnUrl);
            params.put("vnp_IpAddr", "127.0.0.1");
            params.put("vnp_CreateDate", vnp_CreateDate);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            java.util.Iterator<Map.Entry<String, String>> it = params.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, String> entry = it.next();
                String key = entry.getKey();
                String value = entry.getValue();

                hashData.append(key)
                        .append('=')
                        .append(java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.US_ASCII.toString()));

                query.append(java.net.URLEncoder.encode(key, java.nio.charset.StandardCharsets.US_ASCII.toString()))
                     .append('=')
                     .append(java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.US_ASCII.toString()));

                if (it.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }


            // Ký hash HMAC SHA512
            String secureHash = HmacUtil.hmacSHA512(hashData.toString(), vnp_HashSecret);
            query.append("&vnp_SecureHash=").append(secureHash);

            String fullUrl = vnp_Url + "?" + query.toString();

            return fullUrl;

        } catch (Exception e) {
            throw new RuntimeException("VNPay create payment error: " + e.getMessage(), e);
        }
    }

    @Override
    public Payment updatePayment(Payment payment) {
        return paymentRepository.updatePayment(payment);
    }

}
