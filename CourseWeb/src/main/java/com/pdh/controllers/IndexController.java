/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.repositories.impl.CategoryRepositoryImpl;
import com.pdh.repositories.impl.CourseRepositoryImpl;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author duchi
 */
@Controller
public class IndexController {

    @Autowired
    private CourseRepositoryImpl course;
    
    @Autowired
    private CategoryRepositoryImpl cate;

    @RequestMapping("/")
    public String index(Model model, @RequestParam Map<String,String> params) {
        
        model.addAttribute("courses", course.getCourses(params));
        model.addAttribute("categories", cate.getCates());
        return "index";
    }

}
