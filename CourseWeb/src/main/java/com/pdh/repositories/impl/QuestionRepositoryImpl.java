package com.pdh.repositories.impl;

import com.pdh.pojo.Question;
import com.pdh.repositories.QuestionRepository;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.Query;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
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
    
    @Override
    public List<Question> getQuestionsByExamIdWithAnswers(int examId) {
        Session s = this.factory.getObject().getCurrentSession();
        TypedQuery<Question> q = s.createQuery(
            "SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.answerSet WHERE q.examId.id = :examId ORDER BY q.id",
            Question.class);
        q.setParameter("examId", examId);
        return q.getResultList();
    }
    
    @Override
    public Question getQuestionById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Question.class, id);
    }
    
    @Override
    public void addOrUpdate(Question question) {
        Session s = this.factory.getObject().getCurrentSession();
        if (question.getId() != null) {
            s.merge(question);
        } else {
            s.persist(question);
        }
    }
    
    @Override
    public void deleteQuestion(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Question question = this.getQuestionById(id);
        if (question != null) {
            try {
                // Xóa các đáp án liên quan trước
                Query deleteAnswersQuery = s.createNativeQuery(
                    "DELETE FROM answer WHERE question_id = :questionId"
                );
                deleteAnswersQuery.setParameter("questionId", id);
                deleteAnswersQuery.executeUpdate();
                
                // Sau đó xóa câu hỏi
                s.remove(question);
                
            } catch (Exception e) {
                throw new RuntimeException("Không thể xóa câu hỏi: " + e.getMessage());
            }
        }
    }
    
    @Override
    public Map<String, Object> getQuestionsByExamIdWithPagination(int examId, int page, int limit) {
        Session s = this.factory.getObject().getCurrentSession();
        Map<String, Object> result = new HashMap<>();
        
        // Đếm tổng số câu hỏi
        Query countQuery = s.createQuery("SELECT COUNT(q) FROM Question q WHERE q.examId.id = :examId");
        countQuery.setParameter("examId", examId);
        Long total = (Long) countQuery.getSingleResult();
        
        // Lấy câu hỏi có phân trang
        TypedQuery<Question> query = s.createQuery(
            "SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.answerSet WHERE q.examId.id = :examId ORDER BY q.id",
            Question.class);
        query.setParameter("examId", examId);
        query.setFirstResult((page - 1) * limit);
        query.setMaxResults(limit);
        
        List<Question> questions = query.getResultList();
        
        result.put("questions", questions);
        result.put("total", total.intValue());
        result.put("totalPages", (int) Math.ceil((double) total / limit));
        
        return result;
    }
}


