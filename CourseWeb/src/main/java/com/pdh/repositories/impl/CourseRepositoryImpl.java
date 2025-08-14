/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.Course;
import jakarta.persistence.Query;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;

/**
 *
 * @author duchi
 */
@Repository
public class CourseRepositoryImpl {

    @Autowired
    private LocalSessionFactoryBean factory;

    public List<Course> getCourses() {
        try (Session s = this.factory.getObject().openSession()) {
            Query q = s.createQuery("From Course", Course.class);
            return q.getResultList();
        }
    }

    public Course getCourseById(int id) {
        try (Session s = this.factory.getObject().openSession()) {
            return s.find(Course.class, id);
        }
    }
}
