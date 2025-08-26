/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;


import com.pdh.services.CategoryServices;
import com.pdh.services.impl.CourseServicesImpl;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;
import com.pdh.pojo.Course;
import com.pdh.pojo.User;
import java.util.Map;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 *
 * @author duchi
 */
@Controller
@ControllerAdvice
public class IndexController {

    @Autowired
    private CourseServicesImpl courseService;

    @Autowired
    private CategoryServices cateService;

    @Autowired
    private EnrollmentServices enrollmentServices;
    
    @Autowired
    private UserServices userServices;

    @ModelAttribute
    public void commonResponse(Model model) {
        model.addAttribute("categories", cateService.getCates());
    }

    @RequestMapping("/")
    public String index(Model model, @RequestParam Map<String, String> params) {

        model.addAttribute("courses", courseService.getCourses(params));
        // Nếu đã đăng nhập, load danh sách khóa học của tôi
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            User u = this.userServices.getUserByUsername(auth.getName());
            if (u != null) {
                List<Course> myCourses = this.enrollmentServices.getEnrolledCourses(u.getId());
                model.addAttribute("myCourses", myCourses);
            }
        }
        return "index";
    }

}
