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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiIndexController {
    @Autowired
    private CourseServices courseService;
    @Autowired
    private CategoryServices cateService;
    @Autowired
    private EnrollmentServices enrollmentServices;
    @Autowired
    private UserServices userServices;

    

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(cateService.getCates());
    }
    @GetMapping("/courses")
    public ResponseEntity<?> getCourses(@RequestParam Map<String, String> params, Authentication authentication) {
        List<Course> courses = courseService.getCourses(params);

        List<Course> myCourses = new ArrayList<>();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            User u = userServices.getUserByUsername(authentication.getName());
            if (u != null) {
                myCourses = enrollmentServices.getEnrolledCourses(u.getId());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("courses", courses);
        response.put("myCourses", myCourses);

        return ResponseEntity.ok(response);
    }
}


