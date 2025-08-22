/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author duchi
 */
@RestController
@RequestMapping("/api")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentServices enrollmentService;
    
    @Autowired
    private CourseServices courseService;
    
    @Autowired
    private UserServices userService;
    
    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<String> enrollCourse(@PathVariable int courseId, Authentication authentication) {
        try {
            // Lấy thông tin user đang đăng nhập
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            // Lấy thông tin khóa học
            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
            }
            
            // Kiểm tra xem user đã đăng ký khóa học này chưa
            if (enrollmentService.isUserEnrolled(user.getId(), courseId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Already enrolled");
            }
            
            // Tạo enrollment mới
            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(user);
            enrollment.setCourseId(course);
            enrollment.setEnrollAt(new Date());
            enrollment.setStatus("PENDING"); // Trạng thái chờ thanh toán
            
            enrollmentService.createEnrollment(enrollment);
            
            return ResponseEntity.ok("Enrollment successful");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred");
        }
    }
}