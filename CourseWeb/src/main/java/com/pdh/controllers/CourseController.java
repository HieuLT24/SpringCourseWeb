/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.services.CourseServices;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    
    @GetMapping("/courses/{courseId}")
    public String courseDetail(Model model, @PathVariable(value = "courseId") int id){
        Course course = this.courseService.getCourseById(id);
        if (course == null) {
            return "redirect:/";
        }
        model.addAttribute("course", course);
        return "course-detail";
    }
}
