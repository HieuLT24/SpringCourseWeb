package com.pdh.services;

import com.pdh.pojo.Forum;

public interface ForumServices {
    
    public Forum getForumByCourseId(int courseId);
    
    public Forum getForumById(int id);
    
    public void addOrUpdate(Forum forum);
    
    public void deleteForum(int id);
}

