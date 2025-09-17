package com.pdh.repositories.impl;

import com.pdh.pojo.Exam;
import com.pdh.repositories.ExamRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class ExamRepositoryImpl implements ExamRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public List<Exam> getExamsByCourseId(int courseId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Exam> query = b.createQuery(Exam.class);
        Root root = query.from(Exam.class);
        query.select(root);
        
        Predicate predicate = b.equal(root.get("courseId").get("id"), courseId);
        query.where(predicate);
        
        Query q = s.createQuery(query);
        return q.getResultList();
    }
    
    @Override
    public Exam getExamById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Exam.class, id);
    }
    
    @Override
    public void addOrUpdate(Exam exam) {
        Session s = this.factory.getObject().getCurrentSession();
        if (exam.getId() != null) {
            s.merge(exam);
            s.flush();
        } else {
            s.persist(exam);
        }
    }
    
    @Override
    public void deleteExam(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Exam exam = this.getExamById(id);
        if (exam != null) {
            try {
                Query deleteAnswersQuery = s.createNativeQuery(
                    "DELETE FROM answer WHERE question_id IN (SELECT id FROM question WHERE exam_id = :examId)"
                );
                deleteAnswersQuery.setParameter("examId", id);
                deleteAnswersQuery.executeUpdate();
                
                Query deleteQuestionsQuery = s.createNativeQuery(
                    "DELETE FROM question WHERE exam_id = :examId"
                );
                deleteQuestionsQuery.setParameter("examId", id);
                deleteQuestionsQuery.executeUpdate();
                
                Query deleteUserExamQuery = s.createNativeQuery(
                    "DELETE FROM user_exam WHERE exam_id = :examId"
                );
                deleteUserExamQuery.setParameter("examId", id);
                deleteUserExamQuery.executeUpdate();
                
                s.remove(exam);
                
            } catch (Exception e) {
                throw new RuntimeException("Không thể xóa bài kiểm tra: " + e.getMessage());
            }
        }
    }
}

