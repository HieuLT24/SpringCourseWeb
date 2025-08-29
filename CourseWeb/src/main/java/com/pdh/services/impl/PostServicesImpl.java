package com.pdh.services.impl;

import com.pdh.dto.forum.PostDto;
import com.pdh.dto.forum.UserDto;
import com.pdh.pojo.Post;
import com.pdh.pojo.User;
import com.pdh.repositories.PostRepository;
import com.pdh.services.PostServices;
import java.util.List;
import java.util.stream.Collectors;
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
    public List<PostDto> getPostsDtoByForumId(int forumId) {
        List<Post> posts = this.postRepo.getPostsByForumId(forumId);
        return posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Post getPostById(int id) {
        return this.postRepo.getPostById(id);
    }
    
    @Override
    public PostDto getPostDtoById(int id) {
        Post post = this.postRepo.getPostById(id);
        return post != null ? convertToDto(post) : null;
    }
    
    @Override
    public void addOrUpdate(Post post) {
        this.postRepo.addOrUpdate(post);
    }
    
    @Override
    public void deletePost(int id) {
        this.postRepo.deletePost(id);
    }
    
    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        
        // Convert User to UserDto
        User user = post.getUserId();
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

