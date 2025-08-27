package com.pdh.services.impl;

import com.pdh.pojo.Post;
import com.pdh.repositories.PostRepository;
import com.pdh.services.PostServices;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServicesImpl implements PostServices {
    
    @Autowired
    private PostRepository postRepo;
    
    @Override
    public List<Post> getPostsByForumId(int forumId) {
        return this.postRepo.getPostsByForumId(forumId);
    }
    
    @Override
    public Post getPostById(int id) {
        return this.postRepo.getPostById(id);
    }
    
    @Override
    public void addOrUpdate(Post post) {
        this.postRepo.addOrUpdate(post);
    }
    
    @Override
    public void deletePost(int id) {
        this.postRepo.deletePost(id);
    }
}

