/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import java.util.List;

import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;

/**
 *
 * @author duchi
 */
public interface EnrollmentServices {
    Enrollment createEnrollment(Enrollment enrollment);
    boolean isUserEnrolled(int userId, int courseId);
    Enrollment getEnrollmentByUserAndCourse(int userId, int courseId);
    Enrollment updateEnrollment(Enrollment enrollment);
    void deleteEnrollment(int enrollmentId);
    List<Course> getEnrolledCourses(int userId);
    long getEnrollmentCountByCourseId(int courseId);
}