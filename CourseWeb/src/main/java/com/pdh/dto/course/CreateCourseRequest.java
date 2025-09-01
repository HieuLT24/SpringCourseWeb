package com.pdh.dto.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.multipart.MultipartFile;

public class CreateCourseRequest {
    
    @NotBlank(message = "Tiêu đề khóa học không được để trống")
    private String title;
    
    @NotBlank(message = "Mô tả khóa học không được để trống")
    private String description;
    
    @NotNull(message = "Giá khóa học không được để trống")
    @Positive(message = "Giá khóa học phải là số dương")
    private Double price;
    
    @NotBlank(message = "Tên danh mục không được để trống")
    private String categoryName;
    
    private MultipartFile image;
    
    // Constructors
    public CreateCourseRequest() {}
    
    public CreateCourseRequest(String title, String description, Double price, String categoryName, MultipartFile image) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.categoryName = categoryName;
        this.image = image;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public MultipartFile getImage() {
        return image;
    }
    
    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
