package com.pdh.repositories;

import com.pdh.pojo.Post;
import java.util.List;

public interface PostRepository {
    
    public List<Post> getPostsByForumId(int forumId);
    
    public Post getPostById(int id);
    
    public void addOrUpdate(Post post);
    
    public void deletePost(int id);
}

