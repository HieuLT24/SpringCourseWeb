/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;
import com.pdh.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 *
 * @author duchi
 */
@Controller
public class CourseController {
    
    @Autowired
    private CourseServices courseService;
    
    @Autowired
    private EnrollmentServices enrollmentService;
    
    @Autowired
    private UserServices userServices;
    
    
    @GetMapping("/courses/{courseId}")
    public String courseDetail(Model model, @PathVariable(value = "courseId") int id){
        Course course = this.courseService.getCourseById(id);
        if (course == null) {
            return "redirect:/";
        }
        
        // Kiểm tra xem user hiện tại có đăng ký khóa học này không
        boolean isEnrolled = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            User currentUser = this.userServices.getUserByUsername(auth.getName());
            if (currentUser != null)
                isEnrolled = enrollmentService.isUserEnrolled(currentUser.getId(), id);
        }
        
        model.addAttribute("course", course);
        model.addAttribute("isEnrolled", isEnrolled);
        return "course-detail";
    }
}
