/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.Course;
import java.util.List;
import java.util.Map;

/**
 *
 * @author duchi
 */
public interface CourseRepository {
    public List<Course> getCourses(Map<String, String> params);
    public void deleteCourse(int id);
    public Course getCourseById(int id);
    public void addOrUpdate(Course course);
}
