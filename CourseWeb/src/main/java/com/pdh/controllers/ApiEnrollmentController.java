package com.pdh.controllers;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;
import org.springframework.web.bind.annotation.CrossOrigin;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class ApiEnrollmentController {

    @Autowired
    private EnrollmentServices enrollmentService;

    @Autowired
    private CourseServices courseService;

    @Autowired
    private UserServices userService;

    // JwtUtil không còn dùng trực tiếp vì đã có JwtAuthenticationFilter

    @PostMapping("/{courseId}/enrollments")
    public ResponseEntity<?> enrollCourse(@PathVariable int courseId, Authentication authentication, HttpServletRequest request) {
        try {
            String username = (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) ? authentication.getName() : null;

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User not authenticated"));
            }

            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User not found"));
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Course not found"));
            }

            if (enrollmentService.isUserEnrolled(user.getId(), courseId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Already enrolled"));
            }

            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(user);
            enrollment.setCourseId(course);
            enrollment.setEnrollAt(new Date());
            enrollment.setStatus("PENDING");

            enrollmentService.createEnrollment(enrollment);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "message", "Enrollment successful",
                        "enrollmentId", enrollment.getId(),
                        "status", enrollment.getStatus()
                    ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error occurred"));
        }
    }
}
