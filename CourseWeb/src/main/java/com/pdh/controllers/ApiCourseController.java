/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.repositories.impl.CourseRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author duchi
 */
@RestController
@RequestMapping("/api")
public class ApiCourseController {
    @Autowired
    private CourseRepositoryImpl courseRepo;    
    
    
    @DeleteMapping("/courses/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable(value="courseId") int id){
        this.courseRepo.deleteCourse(id);
    }
}
