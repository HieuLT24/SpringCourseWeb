package com.pdh.services;

import com.pdh.dto.forum.CommentDto;
import com.pdh.pojo.Comment;

import java.util.List;

public interface CommentServices {
    public List<Comment> getCommentsByPostId(int postId);
    public List<CommentDto> getCommentsDtoByPostId(int postId);
    public Comment getCommentById(int id);
    public CommentDto getCommentDtoById(int id);
    public void addOrUpdate(Comment comment);
    public void deleteComment(int id);
}
