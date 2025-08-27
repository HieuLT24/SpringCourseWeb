package com.pdh.services.impl;

import com.pdh.pojo.Forum;
import com.pdh.repositories.ForumRepository;
import com.pdh.services.ForumServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ForumServicesImpl implements ForumServices {
    
    @Autowired
    private ForumRepository forumRepo;
    
    @Override
    public Forum getForumByCourseId(int courseId) {
        return this.forumRepo.getForumByCourseId(courseId);
    }
    
    @Override
    public Forum getForumById(int id) {
        return this.forumRepo.getForumById(id);
    }
    
    @Override
    public void addOrUpdate(Forum forum) {
        this.forumRepo.addOrUpdate(forum);
    }
    
    @Override
    public void deleteForum(int id) {
        this.forumRepo.deleteForum(id);
    }
}

