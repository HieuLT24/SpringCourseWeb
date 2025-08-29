/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.pdh.services;

import com.pdh.pojo.Payment;
import com.pdh.dto.payment.CourseHistoryDto;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface PaymentServices {
    Payment processPayment(Payment payment);
    Payment createPayment(Payment payment);
    Payment updatePaymentStatus(int paymentId, String status);
    Payment getPaymentById(int id);
    Payment getPaymentByTransactionId(String transactionId);
    List<Payment> getPaymentsByEnrollmentId(int enrollmentId);
    List<CourseHistoryDto> getCourseHistoryByUserId(int userId);
    boolean verifyPayment(String transactionId);
    String createMoMoPaymentUrl(int paymentId, Double amount);
    String createVNPayPaymentUrl(int paymentId, Double amount);
    Payment updatePayment(Payment payment);
}
