/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;
import com.pdh.repositories.EnrollmentRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author duchi
 */
@Repository
@Transactional
public class EnrollmentRepositoryImpl implements EnrollmentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public void saveEnrollment(Enrollment enrollment) {
        Session s = this.factory.getObject().getCurrentSession();
        if (enrollment.getId() != null) {
            s.merge(enrollment);
        } else {
            s.persist(enrollment);
        }
    }

    @Override
    public Enrollment getEnrollmentByUserAndCourse(int userId, int courseId) {
        Session s = this.factory.getObject().getCurrentSession();
        String hql = "FROM Enrollment e WHERE e.userId.id = :userId AND e.courseId.id = :courseId";
        Query<Enrollment> q = s.createQuery(hql, Enrollment.class);
        q.setParameter("userId", userId);
        q.setParameter("courseId", courseId);
        
        try {
            return q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
    
    @Override
    public void updateEnrollment(Enrollment enrollment) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(enrollment);
    }
    
    @Override
    public void deleteEnrollment(int enrollmentId) {
        Session s = this.factory.getObject().getCurrentSession();
        Enrollment enrollment = s.get(Enrollment.class, enrollmentId);
        if (enrollment != null) {
            s.remove(enrollment);
        }
    }

    @Override
    public java.util.List<Course> getEnrolledCourses(int userId) {
        Session s = this.factory.getObject().getCurrentSession();
        String hql = "SELECT e.courseId FROM Enrollment e WHERE e.userId.id = :userId";
        Query<Course> q = s.createQuery(hql, Course.class);
        q.setParameter("userId", userId);
        return q.getResultList();
    }

    @Override
    public long getEnrollmentCountByCourseId(int courseId) {
        Session s = this.factory.getObject().getCurrentSession();
        String hql = "SELECT COUNT(e.id) FROM Enrollment e WHERE e.courseId.id = :courseId";
        Query<Long> q = s.createQuery(hql, Long.class);
        q.setParameter("courseId", courseId);
        return q.getSingleResult();
    }
}