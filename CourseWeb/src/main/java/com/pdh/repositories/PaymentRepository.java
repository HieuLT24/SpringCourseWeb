/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.Payment;
import com.pdh.dto.payment.CourseHistoryDto;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface PaymentRepository {
    Payment createPayment(Payment payment);
    Payment updatePayment(Payment payment);
    Payment getPaymentById(int id);
    List<Payment> getPaymentsByEnrollmentId(int enrollmentId);
    List<Payment> getPaymentsByStatus(String status);
    Payment getPaymentByTransactionId(String transactionId);
    List<CourseHistoryDto> getCourseHistoryByUserId(int userId);
}
