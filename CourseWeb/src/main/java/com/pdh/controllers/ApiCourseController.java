/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author duchi
 */
@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class ApiCourseController {
    @Autowired
    private CourseServices courseService;

    @Autowired
    private EnrollmentServices enrollmentService;

    @Autowired
    private UserServices userServices;
    // JwtUtil không còn dùng trực tiếp vì đã có JwtAuthenticationFilter

    
    
    @GetMapping("/{courseId}")
    public ResponseEntity<Map<String, Object>> courseDetail(@PathVariable int courseId, jakarta.servlet.http.HttpServletRequest request) {
        Course course = this.courseService.getCourseById(courseId);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("enrollmentCount", enrollmentService.getEnrollmentCountByCourseId(courseId));

        boolean isEnrolled = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) ? auth.getName() : null;
        if (username != null) {
            User currentUser = this.userServices.getUserByUsername(username);
            if (currentUser != null) {
                isEnrolled = enrollmentService.isUserEnrolled(currentUser.getId(), courseId);
            }
        }
        response.put("isEnrolled", isEnrolled);

        return ResponseEntity.ok(response);
    }
}
