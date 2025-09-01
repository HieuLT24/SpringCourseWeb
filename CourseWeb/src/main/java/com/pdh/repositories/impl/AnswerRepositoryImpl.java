package com.pdh.repositories.impl;

import com.pdh.pojo.Answer;
import com.pdh.repositories.AnswerRepository;
import jakarta.persistence.TypedQuery;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class AnswerRepositoryImpl implements AnswerRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Answer> getAnswersByQuestionId(int questionId) {
        Session s = this.factory.getObject().getCurrentSession();
        TypedQuery<Answer> q = s.createQuery(
            "SELECT a FROM Answer a WHERE a.questionId.id = :questionId ORDER BY a.id",
            Answer.class);
        q.setParameter("questionId", questionId);
        return q.getResultList();
    }
    
    @Override
    public Answer getAnswerById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Answer.class, id);
    }
    
    @Override
    public void addOrUpdate(Answer answer) {
        Session s = this.factory.getObject().getCurrentSession();
        if (answer.getId() != null) {
            s.merge(answer);
        } else {
            s.persist(answer);
        }
    }
    
    @Override
    public void deleteAnswer(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Answer answer = this.getAnswerById(id);
        if (answer != null) {
            s.remove(answer);
        }
    }
    
    @Override
    public void deleteAnswersByQuestionId(int questionId) {
        Session s = this.factory.getObject().getCurrentSession();
        TypedQuery<Answer> q = s.createQuery(
            "DELETE FROM Answer a WHERE a.questionId.id = :questionId",
            Answer.class);
        q.setParameter("questionId", questionId);
        q.executeUpdate();
    }
}

