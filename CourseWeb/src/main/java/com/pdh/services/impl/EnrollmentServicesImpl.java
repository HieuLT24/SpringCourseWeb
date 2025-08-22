/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.Enrollment;
import com.pdh.repositories.EnrollmentRepository;
import com.pdh.services.EnrollmentServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
public class EnrollmentServicesImpl implements EnrollmentServices {

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Override
    public void createEnrollment(Enrollment enrollment) {
        this.enrollmentRepo.saveEnrollment(enrollment);
    }

    @Override
    public boolean isUserEnrolled(int userId, int courseId) {
        Enrollment enrollment = this.enrollmentRepo.getEnrollmentByUserAndCourse(userId, courseId);
        return enrollment != null;
    }

    @Override
    public Enrollment getEnrollmentByUserAndCourse(int userId, int courseId) {
        return this.enrollmentRepo.getEnrollmentByUserAndCourse(userId, courseId);
    }
}