package com.pdh.dto.forum;

import java.util.Date;

public class PostDto {
    private Integer id;
    private String title;
    private String content;
    private Date createdAt;
    private UserDto user;
    
    public PostDto() {}
    
    public PostDto(Integer id, String title, String content, Date createdAt, UserDto user) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
    }
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
