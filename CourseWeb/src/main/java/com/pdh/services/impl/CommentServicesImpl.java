package com.pdh.services.impl;

import com.pdh.dto.forum.CommentDto;
import com.pdh.dto.forum.UserDto;
import com.pdh.pojo.Comment;
import com.pdh.pojo.User;
import com.pdh.repositories.CommentRepository;
import com.pdh.services.CommentServices;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentServicesImpl implements CommentServices {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Override
    public List<Comment> getCommentsByPostId(int postId) {
        return commentRepository.getCommentsByPostId(postId);
    }
    
    @Override
    public List<CommentDto> getCommentsDtoByPostId(int postId) {
        List<Comment> comments = commentRepository.getCommentsByPostId(postId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Comment getCommentById(int id) {
        return commentRepository.getCommentById(id);
    }
    
    @Override
    public CommentDto getCommentDtoById(int id) {
        Comment comment = commentRepository.getCommentById(id);
        return comment != null ? convertToDto(comment) : null;
    }
    
    @Override
    public void addOrUpdate(Comment comment) {
        commentRepository.addOrUpdate(comment);
    }
    
    @Override
    public void deleteComment(int id) {
        commentRepository.deleteComment(id);
    }
    
    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        
        // Convert User to UserDto
        User user = comment.getUserId();
        if (user != null) {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());
            userDto.setRole(user.getRole());
            dto.setUser(userDto);
        }
        
        return dto;
    }
}
