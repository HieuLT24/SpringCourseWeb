package com.pdh.repositories;

import com.pdh.pojo.Comment;
import java.util.List;

public interface CommentRepository {
    public List<Comment> getCommentsByPostId(int postId);
    public Comment getCommentById(int id);
    public void addOrUpdate(Comment comment);
    public void deleteComment(int id);
}
