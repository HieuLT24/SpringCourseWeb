package com.pdh.controllers;

import com.pdh.pojo.Category;
import com.pdh.pojo.Course;
import com.pdh.services.CategoryServices;
import com.pdh.services.CourseServices;
import com.pdh.services.StatsServices;
import com.pdh.services.UserServices;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class ApiAdminController {

    @Autowired
    private CourseServices courseService;

    @Autowired
    private CategoryServices categoryService;

    @Autowired
    private StatsServices statsService;

    @Autowired
    private UserServices userService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> adminDashboard(@RequestParam(required = false) Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Course> allCourses = courseService.getCourses(params);
            
            long totalUsers = userService.getUsers().size();
            long totalCourses = allCourses.size();
            long pendingCourses = allCourses.stream()
                .filter(course -> "pending".equals(course.getStatus()))
                .count();
            
            List<Object[]> revenues = statsService.getRevenueByCourse();
            double totalRevenue = revenues.stream()
                .mapToDouble(revenue -> {
                    if (revenue == null || revenue.length < 3) {
                        return 0.0;
                    }
                    Object amount = revenue[2];
                    if (amount instanceof Number) {
                        double value = ((Number) amount).doubleValue();
                        return value;
                    } else {
                        return 0.0;
                    }
                })
                .sum();
            
            result.put("totalUsers", totalUsers);
            result.put("totalCourses", totalCourses);
            result.put("pendingCourses", pendingCourses);
            result.put("totalRevenue", totalRevenue);
            result.put("courses", allCourses);
            result.put("revenues", revenues);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("totalUsers", 0);
            result.put("totalCourses", 0);
            result.put("pendingCourses", 0);
            result.put("totalRevenue", 0.0);
            result.put("courses", java.util.Collections.emptyList());
            result.put("revenues", java.util.Collections.emptyList());
            return ResponseEntity.internalServerError().body(result);
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> listCourses(@RequestParam(required = false) Map<String, String> params) {
        try {
            List<Course> courses = courseService.getCourses(params);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/courses/pending")
    public ResponseEntity<List<Course>> getPendingCourses(@RequestParam(required = false) Map<String, String> params) {
        try {
            List<Course> allCourses = courseService.getCourses(params);
            List<Course> pendingCourses = allCourses.stream()
                .filter(course -> "pending".equals(course.getStatus()))
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(pendingCourses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<Course> getCourse(@PathVariable int courseId) {
        try {
            Course course = this.courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<Course> updateCourse(@PathVariable int courseId, @RequestBody Course course) {
        try {
            Course existing = this.courseService.getCourseById(courseId);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            
            course.setId(courseId);
            this.courseService.addOrUpdate(course);
            
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            System.err.println("Error updating course: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable int courseId) {
        try {
            Course existing = this.courseService.getCourseById(courseId);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            this.courseService.deleteCourse(courseId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories(@RequestParam Map<String, String> params) {
        try {
            return ResponseEntity.ok(categoryService.getCates(params));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<List<Object[]>> stats() {
        try {
            return ResponseEntity.ok(this.statsService.getRevenueByCourse());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/revenue-by-course")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByCourse() {
        try {
            List<Object[]> rawData = this.statsService.getRevenueByCourse();
            List<Map<String, Object>> result = rawData.stream()
                .map(row -> {
                    if (row == null || row.length < 3) {
                        return null;
                    }
                    Map<String, Object> courseRevenue = new HashMap<>();
                    courseRevenue.put("courseId", row[0]); 
                    courseRevenue.put("courseTitle", row[1]); 
                    courseRevenue.put("revenue", row[2]); 
                    return courseRevenue;
                })
                .filter(item -> item != null)
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/total-revenue")
    public ResponseEntity<Map<String, Object>> getTotalRevenue() {
        try {
            List<Object[]> revenues = statsService.getRevenueByCourse();
            double totalRevenue = revenues.stream()
                .mapToDouble(revenue -> {
                    if (revenue == null || revenue.length < 3) {
                        return 0.0;
                    }
                    Object amount = revenue[2]; // revenue[2] is the sum(amount)
                    if (amount instanceof Number) {
                        return ((Number) amount).doubleValue();
                    }
                    return 0.0;
                })
                .sum();
            
            Map<String, Object> result = new HashMap<>();
            result.put("totalRevenue", totalRevenue);
            result.put("currency", "VND");
            result.put("formattedRevenue", String.format("%,.0f VND", totalRevenue));
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("totalRevenue", 0.0);
            errorResult.put("currency", "VND");
            errorResult.put("formattedRevenue", "0 VND");
            errorResult.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResult);
        }
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByMonth(
            @RequestParam int year,
            @RequestParam(required = false) Integer courseId) {
        try {
            List<Object[]> rawData;
            
            if (courseId != null) {
                rawData = statsService.getRevenueByTimeAndCourse("MONTH", year, courseId);
            } else {
                rawData = statsService.getRevenueByTime("MONTH", year);
            }
            
            List<Map<String, Object>> result = rawData.stream()
                .map(row -> {
                    if (row == null || row.length < 2) {
                        return null;
                    }
                    Map<String, Object> monthRevenue = new HashMap<>();
                    monthRevenue.put("month", row[0]);
                    monthRevenue.put("revenue", row[1]);
                    return monthRevenue;
                })
                .filter(item -> item != null)
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }
}
