/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.Payment;
import com.pdh.repositories.PaymentRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *
 * @author duchi
 */
@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public Payment createPayment(Payment payment) {
        Session session = this.factory.getObject().getCurrentSession();
        session.persist(payment);
        return payment;
    }
    
    @Override
    public Payment updatePayment(Payment payment) {
        Session session = this.factory.getObject().getCurrentSession();
        session.merge(payment);
        return payment;
    }
    
    @Override
    public Payment getPaymentById(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Payment.class, id);
    }
    
    @Override
    public List<Payment> getPaymentsByEnrollmentId(int enrollmentId) {
        Session session = this.factory.getObject().getCurrentSession();
        Query<Payment> query = session.createQuery(
            "FROM Payment p WHERE p.enrollmentId.id = :enrollmentId", 
            Payment.class
        );
        query.setParameter("enrollmentId", enrollmentId);
        return query.getResultList();
    }
    
    @Override
    public List<Payment> getPaymentsByStatus(String status) {
        Session session = this.factory.getObject().getCurrentSession();
        Query<Payment> query = session.createQuery(
            "FROM Payment p WHERE p.status = :status", 
            Payment.class
        );
        query.setParameter("status", status);
        return query.getResultList();
    }
    
    @Override
    public Payment getPaymentByTransactionId(String transactionId) {
        Session session = this.factory.getObject().getCurrentSession();
        Query<Payment> query = session.createQuery(
            "FROM Payment p WHERE p.transactionId = :transactionId", 
            Payment.class
        );
        query.setParameter("transactionId", transactionId);
        return query.uniqueResult();
    }
}
