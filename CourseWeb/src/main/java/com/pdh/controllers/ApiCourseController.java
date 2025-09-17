/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.User;
import com.pdh.pojo.Category;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;
import com.pdh.services.CategoryServices;
import com.pdh.dto.course.CreateCourseRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    
    @Autowired
    private CategoryServices categoryService;

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Category> categories = categoryService.getCates(null);
            response.put("success", true);
            response.put("categories", categories);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createCourse(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("categoryName") String categoryName,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                response.put("success", false);
                response.put("message", "Bạn cần đăng nhập để thực hiện chức năng này");
                return ResponseEntity.status(401).body(response);
            }
            
            String username = auth.getName();
            User currentUser = userServices.getUserByUsername(username);
            
            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy thông tin người dùng");
                return ResponseEntity.status(400).body(response);
            }
            
            if (!"TEACHER".equals(currentUser.getRole())) {
                response.put("success", false);
                response.put("message", "Chỉ giáo viên mới có thể tạo khóa học");
                return ResponseEntity.status(403).body(response);
            }
            
            CreateCourseRequest request = new CreateCourseRequest();
            request.setTitle(title.trim());
            request.setDescription(description.trim());
            request.setPrice(price);
            request.setCategoryName(categoryName.trim());
            request.setImage(image);
            
            Course newCourse = courseService.createCourse(request, currentUser.getId());
            
            response.put("success", true);
            response.put("message", "Tạo khóa học thành công! Khóa học đang chờ admin duyệt.");
            response.put("course", newCourse);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating course: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra khi tạo khóa học: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
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
    
    @GetMapping("/teacher/my-courses")
    public ResponseEntity<Map<String, Object>> getMyTeacherCourses() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                response.put("success", false);
                response.put("message", "Bạn cần đăng nhập để thực hiện chức năng này");
                return ResponseEntity.status(401).body(response);
            }
            
            String username = auth.getName();
            User currentUser = userServices.getUserByUsername(username);
            
            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy thông tin người dùng");
                return ResponseEntity.status(400).body(response);
            }
            
            if (!"TEACHER".equals(currentUser.getRole())) {
                response.put("success", false);
                response.put("message", "Chỉ giáo viên mới có thể truy cập chức năng này");
                return ResponseEntity.status(403).body(response);
            }
            
            List<Course> allCourses = courseService.getCoursesByTeacher(currentUser.getId());
            
            List<Course> activeCourses = new ArrayList<>();
            List<Course> pendingCourses = new ArrayList<>();
            
            for (Course course : allCourses) {
                if ("active".equals(course.getStatus())) {
                    activeCourses.add(course);
                } else if ("pending".equals(course.getStatus())) {
                    pendingCourses.add(course);
                }
            }
            
            response.put("success", true);
            response.put("activeCourses", activeCourses);
            response.put("pendingCourses", pendingCourses);
            response.put("totalActive", activeCourses.size());
            response.put("totalPending", pendingCourses.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting teacher courses: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra khi lấy danh sách khóa học: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
