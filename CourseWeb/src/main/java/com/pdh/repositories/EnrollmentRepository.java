/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.Enrollment;
import com.pdh.pojo.Course;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface EnrollmentRepository {
    void saveEnrollment(Enrollment enrollment);
    Enrollment getEnrollmentByUserAndCourse(int userId, int courseId);
    void updateEnrollment(Enrollment enrollment);
    void deleteEnrollment(int enrollmentId);
    List<Course> getEnrolledCourses(int userId);
    long getEnrollmentCountByCourseId(int courseId);
}