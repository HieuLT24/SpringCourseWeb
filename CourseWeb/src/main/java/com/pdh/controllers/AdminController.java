/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.services.CategoryServices;
import com.pdh.services.CourseServices;
import com.pdh.services.StatsServices;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author duchi
 */
@Controller
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private CourseServices courseService;
    
    @Autowired
    private CategoryServices categoryService;
    
    @Autowired
    private StatsServices statsService;
    
    @ModelAttribute
    public void commonResponse(Model model) {
        model.addAttribute("categories", categoryService.getCates());
    }
    
    @GetMapping
    public String adminDashboard(Model model, @RequestParam(required = false) Map<String, String> params) {
        try {
            model.addAttribute("courses", courseService.getCourses(params));
            model.addAttribute("revenues", statsService.getRevenueByProduct());
            return "admin/dashboard";
        } catch (Exception e) {
            // Fallback với dữ liệu trống
            model.addAttribute("courses", java.util.Collections.emptyList());
            model.addAttribute("revenues", java.util.Collections.emptyList());
            return "admin/dashboard";
        }
    }
    
    
    @GetMapping("/courses")
    public String coursesList(Model model, @RequestParam(required = false) Map<String, String> params) {
        try {
            model.addAttribute("courses", courseService.getCourses(params));
            model.addAttribute("course", new Course());
            return "admin/courses";
        } catch (Exception e) {
            model.addAttribute("courses", java.util.Collections.emptyList());
            model.addAttribute("course", new Course());
            return "admin/courses";
        }
    }
    
    @GetMapping("/courses/new")
    public String newCourse(Model model) {
        model.addAttribute("course", new Course());
        return "admin/course-form";
    }
    
    @GetMapping("/courses/{courseId}/edit")
    public String editCourse(Model model, @PathVariable(value = "courseId") int id) {
        try {
            Course course = this.courseService.getCourseById(id);
            if (course == null) {
                return "redirect:/admin/courses";
            }
            model.addAttribute("course", course);
            return "admin/course-form";
        } catch (Exception e) {
            return "redirect:/admin/courses";
        }
    }
    
    @PostMapping("/courses")
    public String saveCourse(@ModelAttribute(value = "course") Course course) {
        this.courseService.addOrUpdate(course);
        return "redirect:./courses";
    }
    
    @GetMapping("/stats") 
    public String stats(Model model) {
        try {
            model.addAttribute("revenues", this.statsService.getRevenueByProduct());
            return "admin/stats";
        } catch (Exception e) {
            model.addAttribute("revenues", java.util.Collections.emptyList());
            return "admin/stats";
        }
    }
}