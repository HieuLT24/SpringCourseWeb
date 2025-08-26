package com.pdh.services;

import com.pdh.pojo.Post;
import java.util.List;

public interface PostServices {
    
    public List<Post> getPostsByForumId(int forumId);
    
    public Post getPostById(int id);
    
    public void addOrUpdate(Post post);
    
    public void deletePost(int id);
}
