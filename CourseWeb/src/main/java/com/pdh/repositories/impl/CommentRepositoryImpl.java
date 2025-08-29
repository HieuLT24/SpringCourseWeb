package com.pdh.repositories.impl;

import com.pdh.pojo.Comment;
import com.pdh.repositories.CommentRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class CommentRepositoryImpl implements CommentRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public List<Comment> getCommentsByPostId(int postId) {
        Session s = this.factory.getObject().getCurrentSession();
        // Sử dụng HQL với JOIN FETCH để lấy user data
        String hql = "FROM Comment c JOIN FETCH c.userId WHERE c.postId.id = :postId ORDER BY c.createdAt ASC";
        Query q = s.createQuery(hql, Comment.class);
        q.setParameter("postId", postId);
        return q.getResultList();
    }
    
    @Override
    public Comment getCommentById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        // Sử dụng HQL với JOIN FETCH để lấy user data
        String hql = "FROM Comment c JOIN FETCH c.userId WHERE c.id = :id";
        Query q = s.createQuery(hql, Comment.class);
        q.setParameter("id", id);
        List<Comment> results = q.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }
    
    @Override
    public void addOrUpdate(Comment comment) {
        Session s = this.factory.getObject().getCurrentSession();
        if (comment.getId() != null) {
            s.merge(comment);
        } else {
            s.persist(comment);
        }
    }
    
    @Override
    public void deleteComment(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Comment comment = this.getCommentById(id);
        if (comment != null) {
            s.remove(comment);
        }
    }
}
