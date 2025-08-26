package com.pdh.repositories;

import com.pdh.pojo.Forum;

public interface ForumRepository {
    
    public Forum getForumByCourseId(int courseId);
    
    public Forum getForumById(int id);
    
    public void addOrUpdate(Forum forum);
    
    public void deleteForum(int id);
}
