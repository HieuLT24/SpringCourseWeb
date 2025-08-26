package com.pdh.repositories.impl;

import com.pdh.pojo.Lecture;
import com.pdh.repositories.LectureRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class LectureRepositoryImpl implements LectureRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public List<Lecture> getLecturesByCourseId(int courseId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Lecture> query = b.createQuery(Lecture.class);
        Root root = query.from(Lecture.class);
        query.select(root);
        
        Predicate predicate = b.equal(root.get("courseId").get("id"), courseId);
        query.where(predicate);
        
        Query q = s.createQuery(query);
        return q.getResultList();
    }
    
    @Override
    public Lecture getLectureById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Lecture.class, id);
    }
    
    @Override
    public void addOrUpdate(Lecture lecture) {
        Session s = this.factory.getObject().getCurrentSession();
        if (lecture.getId() != null) {
            s.merge(lecture);
        } else {
            s.persist(lecture);
        }
    }
    
    @Override
    public void deleteLecture(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Lecture lecture = this.getLectureById(id);
        if (lecture != null) {
            s.remove(lecture);
        }
    }
}
