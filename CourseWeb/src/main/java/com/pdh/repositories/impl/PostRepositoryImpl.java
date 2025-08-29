package com.pdh.repositories.impl;

import com.pdh.pojo.Post;
import com.pdh.repositories.PostRepository;
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
public class PostRepositoryImpl implements PostRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public List<Post> getPostsByForumId(int forumId) {
        Session s = this.factory.getObject().getCurrentSession();
        // Sử dụng HQL với JOIN FETCH để lấy user data
        String hql = "FROM Post p JOIN FETCH p.userId WHERE p.forumId.id = :forumId ORDER BY p.createdAt DESC";
        Query q = s.createQuery(hql, Post.class);
        q.setParameter("forumId", forumId);
        return q.getResultList();
    }
    
    @Override
    public Post getPostById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        // Sử dụng HQL với JOIN FETCH để lấy user data
        String hql = "FROM Post p JOIN FETCH p.userId WHERE p.id = :id";
        Query q = s.createQuery(hql, Post.class);
        q.setParameter("id", id);
        List<Post> results = q.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }
    
    @Override
    public void addOrUpdate(Post post) {
        Session s = this.factory.getObject().getCurrentSession();
        if (post.getId() != null) {
            s.merge(post);
        } else {
            s.persist(post);
        }
    }
    
    @Override
    public void deletePost(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Post post = this.getPostById(id);
        if (post != null) {
            s.remove(post);
        }
    }
}

