/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.Course;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    private static final int PAGE_SIZE = 8;
    @Autowired
    private LocalSessionFactoryBean factory;

    public List<Course> getCourses(Map<String, String> params) {
        Session s = this.factory.getObject().openSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Course> query = b.createQuery(Course.class);
        Root root = query.from(Course.class);
        query.select(root);

        if (params != null) {

            List<Predicate> predicates = new ArrayList<>();

            String kw = params.get("kw");
            if (kw != null && !kw.isEmpty()) {
                predicates.add(b.like(root.get("title"), String.format("%%%s%%", kw)));
            }

            String fromPrice = params.get("fromPrice");
            if (fromPrice != null && !fromPrice.isEmpty()) {
                predicates.add(b.greaterThanOrEqualTo(root.get("price"), fromPrice));
            }

            String toPrice = params.get("toPrice");
            if (toPrice != null && !toPrice.isEmpty()) {
                predicates.add(b.lessThanOrEqualTo(root.get("price"), toPrice));
            }

            String cateId = params.get("cateId");
            if (cateId != null && !cateId.isEmpty()) {
                predicates.add(b.equal(root.get("categoryId").as(Integer.class), cateId));
            }

            query.where(predicates);

            String orderBy = params.get("orderBy");
            if (orderBy != null && !orderBy.isEmpty()) {
                query.orderBy(b.desc(root.get(orderBy)));
            }
        }
        Query q = s.createQuery(query);

        if (params != null) {
            String p = params.get("page");
            if (p != null && !p.isEmpty()) {
                int page = Integer.parseInt(p);

                int start = (page - 1) * PAGE_SIZE;

                q.setMaxResults(PAGE_SIZE);
                q.setFirstResult(start);
            }
        }
        return q.getResultList();

    }

    public void deleteCourse(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Course course = this.getCourseById(id);
        
        s.remove(course);

    }

    public Course getCourseById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Course.class, id);

    }

    public void addOrUpdate(Course course) {
        Session s = this.factory.getObject().getCurrentSession();

        if (course.getId() != null) {
            s.merge(course);
        } else {
            s.persist(course);
        }
    }
}
