/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pdh.pojo.Course;
import com.pdh.pojo.Category;
import com.pdh.pojo.User;
import com.pdh.repositories.CourseRepository;
import com.pdh.services.CourseServices;
import com.pdh.services.CategoryServices;
import com.pdh.services.UserServices;
import com.pdh.dto.course.CreateCourseRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author duchi
 */
@Service
public class CourseServicesImpl implements CourseServices {

    @Autowired
    private CourseRepository courseRepo;
    
    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private CategoryServices categoryService;
    
    @Autowired
    private UserServices userService;

    @Override
    public List<Course> getCourses(Map<String, String> params) {
        return this.courseRepo.getCourses(params);
    }

    @Override
    public void deleteCourse(int id) {
        this.courseRepo.deleteCourse(id);
    }

    @Override
    public Course getCourseById(int id) {
        return this.courseRepo.getCourseById(id);
    }

    @Override
    public void addOrUpdate(Course course) {
        if (course.getFile() != null && !course.getFile().isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(course.getFile().getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                course.setImage((String) res.get("secure_url"));
            } catch (IOException ex) {
                course.setImage("https://res.cloudinary.com/dxxwcby8l/image/upload/v1647248652/dkeolz3ghc0eino87iec.jpg");
            }
        }

        this.courseRepo.addOrUpdate(course);
    }
    
    @Override
    @Transactional
    public Course createCourse(CreateCourseRequest request, Integer teacherId) {
        try {
            if (request == null || teacherId == null) {
                throw new IllegalArgumentException("Request và teacherId không được null");
            }
            
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Tiêu đề khóa học không được để trống");
            }
            
            if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
                throw new IllegalArgumentException("Mô tả khóa học không được để trống");
            }
            
            if (request.getPrice() == null || request.getPrice() < 0) {
                throw new IllegalArgumentException("Giá khóa học không hợp lệ");
            }
            
            if (request.getCategoryName() == null || request.getCategoryName().trim().isEmpty()) {
                throw new IllegalArgumentException("Tên danh mục không được để trống");
            }
            
            Course course = new Course();
            course.setTitle(request.getTitle().trim());
            course.setDescription(request.getDescription().trim());
            course.setPrice(request.getPrice());
            course.setStatus("pending");
            
            String categoryName = request.getCategoryName().trim();
            Category category = categoryService.getCategoryByName(categoryName);
            if (category == null) {
                try {
                    category = categoryService.createCategory(categoryName);
                } catch (Exception e) {
                    System.err.println("Error creating category: " + e.getMessage());
                    throw new RuntimeException("Không thể tạo danh mục mới: " + e.getMessage());
                }
            }
            course.setCategoryId(category);
            
            User teacher = userService.getUserById(teacherId);
            if (teacher == null) {
                throw new RuntimeException("Không tìm thấy thông tin giáo viên với ID: " + teacherId);
            }
            
            if (!"TEACHER".equals(teacher.getRole())) {
                throw new RuntimeException("Người dùng không có quyền tạo khóa học. Role hiện tại: " + teacher.getRole());
            }
            
            course.setTeacherId(teacher);
            
            if (request.getImage() != null && !request.getImage().isEmpty()) {
                try {
                    Map res = this.cloudinary.uploader().upload(request.getImage().getBytes(), ObjectUtils.asMap("resource_type", "image", "folder","courses_img" ));
                    course.setImage((String) res.get("secure_url"));
                } catch (IOException ex) {
                    System.err.println("Error uploading image to Cloudinary: " + ex.getMessage());
                    course.setImage("https://res.cloudinary.com/dxxwcby8l/image/upload/v1647248652/dkeolz3ghc0eino87iec.jpg");
                } catch (Exception ex) {
                    System.err.println("Unexpected error during image upload: " + ex.getMessage());
                    course.setImage("https://res.cloudinary.com/dxxwcby8l/image/upload/v1647248652/dkeolz3ghc0eino87iec.jpg");
                }
            } else {
                course.setImage("https://res.cloudinary.com/dxxwcby8l/image/upload/v1647248652/dkeolz3ghc0eino87iec.jpg");
            }
            
            try {
                this.courseRepo.addOrUpdate(course);
                return course;
            } catch (Exception e) {
                System.err.println("Error saving course to database: " + e.getMessage());
                throw new RuntimeException("Không thể lưu khóa học vào cơ sở dữ liệu: " + e.getMessage());
            }
            
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error in createCourse service: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi không xác định khi tạo khóa học: " + e.getMessage());
        }
    }
    
    @Override
    public List<Course> getCoursesByTeacher(Integer teacherId) {
        return this.courseRepo.getCoursesByTeacher(teacherId);
    }
}
