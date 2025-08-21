/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.Course;
import com.pdh.pojo.Enrollment;
import com.pdh.pojo.Payment;
import com.pdh.repositories.StatsRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import java.util.List;
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
public class StatsRepositoryImpl implements StatsRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Object[]> getRevenueByCourse() {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = b.createQuery(Object[].class);

        Root root = query.from(Payment.class);
        Join<Payment, Enrollment> enrollmentJoin = root.join("enrollmentId");
        Join<Enrollment, Course> courseJoin = enrollmentJoin.join("courseId");
        query.multiselect(
                courseJoin.get("id"),
                courseJoin.get("title"),
                b.sum(root.get("amount"))
        );

        query.where(b.equal(root.get("status"), "SUCCESS"));
        query.groupBy(courseJoin.get("id"), courseJoin.get("title"));

        Query q = s.createQuery(query);
        return q.getResultList();
    }

    @Override
    public List<Object[]> getRevenueByTime(String time, int year) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = b.createQuery(Object[].class);

        Root<Payment> root = query.from(Payment.class);
        Expression<Integer> timeExpr = b.function(time, Integer.class, root.get("timeStamp"));
        query.multiselect(
                timeExpr,
                b.sum(root.get("amount"))
        );
        query.where(
                b.equal(b.function("YEAR", Integer.class, root.get("timeStamp")), year),
                b.equal(root.get("status"), "SUCCESS")
        );

        query.groupBy(timeExpr);
        query.orderBy(b.asc(timeExpr));

        Query q = s.createQuery(query);
        return q.getResultList();
    }

}
