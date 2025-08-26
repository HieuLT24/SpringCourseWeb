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
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Post> query = b.createQuery(Post.class);
        Root root = query.from(Post.class);
        query.select(root);
        
        Predicate predicate = b.equal(root.get("forumId").get("id"), forumId);
        query.where(predicate);
        
        Query q = s.createQuery(query);
        return q.getResultList();
    }
    
    @Override
    public Post getPostById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.find(Post.class, id);
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
