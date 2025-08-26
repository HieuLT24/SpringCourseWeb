/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;
import com.pdh.repositories.EnrollmentRepository;
import com.pdh.services.EnrollmentServices;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
@Transactional
public class EnrollmentServicesImpl implements EnrollmentServices {

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Override
    public Enrollment createEnrollment(Enrollment enrollment) {
        this.enrollmentRepo.saveEnrollment(enrollment);
        return enrollment;
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
    
    @Override
    public Enrollment updateEnrollment(Enrollment enrollment) {
        this.enrollmentRepo.updateEnrollment(enrollment);
        return enrollment;
    }
    
    @Override
    public void deleteEnrollment(int enrollmentId) {
        this.enrollmentRepo.deleteEnrollment(enrollmentId);
    }

    @Override
    public List<Course> getEnrolledCourses(int userId) {
        return this.enrollmentRepo.getEnrolledCourses(userId);
    }
}