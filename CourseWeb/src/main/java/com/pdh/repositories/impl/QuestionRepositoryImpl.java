package com.pdh.repositories.impl;

import com.pdh.pojo.Question;
import com.pdh.repositories.QuestionRepository;
import jakarta.persistence.TypedQuery;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class QuestionRepositoryImpl implements QuestionRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Question> getQuestionsByExamId(int examId) {
        Session s = this.factory.getObject().getCurrentSession();
        // Fetch join answers để khởi tạo answerSet trước khi serialize JSON
        TypedQuery<Question> q = s.createQuery(
            "SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.answerSet WHERE q.examId.id = :examId",
            Question.class);
        q.setParameter("examId", examId);
        return q.getResultList();
    }
}


