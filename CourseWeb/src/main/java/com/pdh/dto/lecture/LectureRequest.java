package com.pdh.dto.lecture;

import org.springframework.web.multipart.MultipartFile;

public class LectureRequest {
    private String content;
    private MultipartFile video;
    private MultipartFile attachment;
    private Integer courseId;
    
    public LectureRequest() {}
    
    public LectureRequest(String content, MultipartFile video, MultipartFile attachment, Integer courseId) {
        this.content = content;
        this.video = video;
        this.attachment = attachment;
        this.courseId = courseId;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public MultipartFile getVideo() {
        return video;
    }
    
    public void setVideo(MultipartFile video) {
        this.video = video;
    }
    
    public MultipartFile getAttachment() {
        return attachment;
    }
    
    public void setAttachment(MultipartFile attachment) {
        this.attachment = attachment;
    }
    
    public Integer getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }
}
