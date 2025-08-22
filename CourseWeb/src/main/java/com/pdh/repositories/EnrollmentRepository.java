/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.Enrollment;

/**
 *
 * @author duchi
 */
public interface EnrollmentRepository {
    void saveEnrollment(Enrollment enrollment);
    Enrollment getEnrollmentByUserAndCourse(int userId, int courseId);
}