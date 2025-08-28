package com.pdh.controllers;

import com.pdh.pojo.Category;
import com.pdh.pojo.Course;
import com.pdh.services.CategoryServices;
import com.pdh.services.CourseServices;
import com.pdh.services.StatsServices;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        try {
            return ResponseEntity.ok(categoryService.getCates());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> adminDashboard(@RequestParam(required = false) Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("courses", courseService.getCourses(params));
            result.put("revenues", statsService.getRevenueByProduct());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("courses", java.util.Collections.emptyList());
            result.put("revenues", java.util.Collections.emptyList());
            return ResponseEntity.internalServerError().body(result);
        }
    }
    
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> listCourses(@RequestParam(required = false) Map<String, String> params) {
        return ResponseEntity.ok(courseService.getCourses(params));
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

    @PostMapping("/courses")
    public ResponseEntity<Course> saveCourse(@RequestBody Course course) {
        try {
            this.courseService.addOrUpdate(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(course);
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

    @GetMapping("/stats")
    public ResponseEntity<List<Object[]>> stats() {
        try {
            return ResponseEntity.ok(this.statsService.getRevenueByProduct());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.emptyList());
        }
    }
}


