/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pdh.pojo.Course;
import com.pdh.repositories.CourseRepository;
import com.pdh.services.CourseServices;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
public class CourseServicesImpl implements CourseServices {

    @Autowired
    private CourseRepository courseRepo;
    
    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<Course> getCourses(Map<String, String> params) {
        return this.courseRepo.getCourses(params);
    }

    @Override
    public void deleteCourse(int id) {
        this.courseRepo.deleteCourse(id);
    }

    @Override
    public Course getCourseById(int id) {
        return this.courseRepo.getCourseById(id);
    }

    @Override
    public void addOrUpdate(Course course) {
        if (!course.getFile().isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(course.getFile().getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                course.setImage((String) res.get("secure_url"));
            } catch (IOException ex) {
                course.setImage("https://res.cloudinary.com/dxxwcby8l/image/upload/v1647248652/dkeolz3ghc0eino87iec.jpg");
            }
        }

        this.courseRepo.addOrUpdate(course);
    }

}
