package com.pdh.repositories.impl;

import com.pdh.pojo.UserExam;
import com.pdh.repositories.UserExamRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class UserExamRepositoryImpl implements UserExamRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public UserExam save(UserExam ue) {
        Session s = this.factory.getObject().getCurrentSession();
        if (ue.getId() == null) {
            s.persist(ue);
        } else {
            s.merge(ue);
        }
        return ue;
    }

    @Override
    public java.math.BigDecimal findBestScore(int userId, int examId) {
        Session s = this.factory.getObject().getCurrentSession();
        var q = s.createQuery(
            "SELECT MAX(ue.score) FROM UserExam ue WHERE ue.userId.id = :uid AND ue.examId.id = :eid",
            java.math.BigDecimal.class);
        q.setParameter("uid", userId);
        q.setParameter("eid", examId);
        return q.uniqueResult();
    }
}


