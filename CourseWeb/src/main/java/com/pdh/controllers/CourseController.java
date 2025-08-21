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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

/**
 *
 * @author duchi
 */
@Controller
public class CourseController {
    
    @Autowired
    private CourseServices courseService;
    
    @GetMapping("/courses")
    public String list(Model model){
        model.addAttribute("course", new Course());
        return "courses";
    }
    @GetMapping("/courses/{courseId}")
    public String update(Model model, @PathVariable(value = "courseId") int id){
        model.addAttribute("course", this.courseService.getCourseById(id));
        return "courses";
    }
    
    //cần validate đầu vào trước khi lưu vào csdl
    @PostMapping("/courses")
    public String create(@ModelAttribute(value = "course") Course course){
        this.courseService.addOrUpdate(course);
        
        return "redirect:/";
    }
}
