package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.User;
import com.pdh.services.CategoryServices;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiIndexController {
    @Autowired
    private CourseServices courseService;
    @Autowired
    private CategoryServices cateService;
    @Autowired
    private EnrollmentServices enrollmentServices;
    @Autowired
    private UserServices userServices;
    @Autowired
    private com.pdh.utils.JwtUtil jwtUtil;

    

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(cateService.getCates(params));
    }
    @GetMapping("/courses")
    public ResponseEntity<?> getCourses(@RequestParam Map<String, String> params, Authentication authentication, HttpServletRequest request) {
        List<Course> courses = courseService.getCourses(params);

        List<Course> myCourses = new ArrayList<>();
        // Ưu tiên lấy từ SecurityContext nếu đã có
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            User u = userServices.getUserByUsername(authentication.getName());
            if (u != null) {
                myCourses = enrollmentServices.getEnrolledCourses(u.getId());
            }
        } else {
            // Fallback: đọc JWT từ header Authorization để xác định người dùng
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.validateToken(token);
                if (username != null) {
                    User u = userServices.getUserByUsername(username);
                    if (u != null) {
                        myCourses = enrollmentServices.getEnrolledCourses(u.getId());
                    }
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("courses", courses);
        response.put("myCourses", myCourses);

        return ResponseEntity.ok(response);
    }
}


