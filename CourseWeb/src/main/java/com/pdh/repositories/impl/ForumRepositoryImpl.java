package com.pdh.repositories.impl;

import com.pdh.pojo.Forum;
import com.pdh.repositories.ForumRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class ForumRepositoryImpl implements ForumRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public Forum getForumByCourseId(int courseId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Forum> query = b.createQuery(Forum.class);
        Root root = query.from(Forum.class);
        query.select(root);
        
        Predicate predicate = b.equal(root.get("courseId").get("id"), courseId);
        query.where(predicate);
        
        Query q = s.createQuery(query);
        List<Forum> forums = q.getResultList();
        return forums.isEmpty() ? null : forums.get(0);
    }
    
    @Override
    public Forum getForumById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Forum.class, id);
    }
    
    @Override
    public void addOrUpdate(Forum forum) {
        Session s = this.factory.getObject().getCurrentSession();
        if (forum.getId() != null) {
            s.merge(forum);
        } else {
            s.persist(forum);
        }
    }
    
    @Override
    public void deleteForum(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Forum forum = this.getForumById(id);
        if (forum != null) {
            s.remove(forum);
        }
    }
}
