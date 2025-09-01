package com.pdh.services.impl;

import com.pdh.pojo.Lecture;
import com.pdh.pojo.Course;
import com.pdh.pojo.User;
import com.pdh.repositories.LectureRepository;
import com.pdh.repositories.CourseRepository;
import com.pdh.services.LectureServices;
import com.pdh.services.CourseServices;
import com.pdh.services.UserServices;
import com.pdh.dto.lecture.LectureRequest;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LectureServicesImpl implements LectureServices {
    
    @Autowired
    private LectureRepository lectureRepo;
    
    @Autowired
    private CourseRepository courseRepo;
    
    @Autowired
    private CourseServices courseService;
    
    @Autowired
    private UserServices userService;
    
    @Autowired
    private Cloudinary cloudinary;
    
    @Override
    public List<Lecture> getLecturesByCourseId(int courseId) {
        return this.lectureRepo.getLecturesByCourseId(courseId);
    }
    
    @Override
    public Lecture getLectureById(int id) {
        return this.lectureRepo.getLectureById(id);
    }
    
    @Override
    public void addOrUpdate(Lecture lecture) {
        this.lectureRepo.addOrUpdate(lecture);
    }
    
    @Override
    public void deleteLecture(int id) {
        this.lectureRepo.deleteLecture(id);
    }
    
    @Override
    public Lecture createLecture(LectureRequest request) {
        try {
            // Validate authentication
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                throw new RuntimeException("Bạn cần đăng nhập để thực hiện chức năng này");
            }
            
            String username = auth.getName();
            User currentUser = userService.getUserByUsername(username);
            
            if (currentUser == null) {
                throw new RuntimeException("Không tìm thấy thông tin người dùng");
            }
            
            // Kiểm tra xem user có phải là teacher của course này không
            Course course = courseService.getCourseById(request.getCourseId());
            if (course == null) {
                throw new RuntimeException("Không tìm thấy khóa học");
            }
            
            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                throw new RuntimeException("Bạn không có quyền thêm bài giảng cho khóa học này");
            }
            
            Lecture lecture = new Lecture();
            lecture.setContent(request.getContent().trim());
            lecture.setCreatedAt(new Date());
            lecture.setCourseId(course);
            
            // Upload video nếu có
            if (request.getVideo() != null && !request.getVideo().isEmpty()) {
                try {
                    Map result = cloudinary.uploader().upload(
                        request.getVideo().getBytes(), 
                        ObjectUtils.asMap("resource_type", "video", "folder", "lectures_vid")
                    );
                    lecture.setVideoUrl((String) result.get("secure_url"));
                } catch (IOException e) {
                    throw new RuntimeException("Không thể upload video: " + e.getMessage());
                }
            }
            
            // Upload attachment nếu có
            if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
                try {
                    Map result = cloudinary.uploader().upload(
                        request.getAttachment().getBytes(), 
                        ObjectUtils.asMap("resource_type", "raw", "folder", "lectures_file")
                    );
                    lecture.setAttachmentUrl((String) result.get("secure_url"));
                } catch (IOException e) {
                    throw new RuntimeException("Không thể upload file đính kèm: " + e.getMessage());
                }
            }
            
            this.lectureRepo.addOrUpdate(lecture);
            return lecture;
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo bài giảng: " + e.getMessage());
        }
    }
    
    @Override
    public Lecture updateLecture(int lectureId, LectureRequest request) {
        try {
            // Validate authentication
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                throw new RuntimeException("Bạn cần đăng nhập để thực hiện chức năng này");
            }
            
            String username = auth.getName();
            User currentUser = userService.getUserByUsername(username);
            
            if (currentUser == null) {
                throw new RuntimeException("Không tìm thấy thông tin người dùng");
            }
            
            // Lấy lecture hiện tại
            Lecture existingLecture = this.lectureRepo.getLectureById(lectureId);
            if (existingLecture == null) {
                throw new RuntimeException("Không tìm thấy bài giảng");
            }
            
            // Kiểm tra xem user có phải là teacher của course này không
            Course course = courseService.getCourseById(existingLecture.getCourseId().getId());
            if (course == null) {
                throw new RuntimeException("Không tìm thấy khóa học");
            }
            
            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                throw new RuntimeException("Bạn không có quyền chỉnh sửa bài giảng này");
            }
            
            // Cập nhật thông tin cơ bản
            existingLecture.setContent(request.getContent().trim());
            
            // Upload video mới nếu có
            if (request.getVideo() != null && !request.getVideo().isEmpty()) {
                try {
                    Map result = cloudinary.uploader().upload(
                        request.getVideo().getBytes(), 
                        ObjectUtils.asMap("resource_type", "video", "folder", "lectures_vid")
                    );
                    existingLecture.setVideoUrl((String) result.get("secure_url"));
                } catch (IOException e) {
                    throw new RuntimeException("Không thể upload video: " + e.getMessage());
                }
            }
            
            // Upload attachment mới nếu có
            if (request.getAttachment() != null && !request.getAttachment().isEmpty()) {
                try {
                    Map result = cloudinary.uploader().upload(
                        request.getAttachment().getBytes(), 
                        ObjectUtils.asMap("resource_type", "raw", "folder", "lectures_file")
                    );
                    existingLecture.setAttachmentUrl((String) result.get("secure_url"));
                } catch (IOException e) {
                    throw new RuntimeException("Không thể upload file đính kèm: " + e.getMessage());
                }
            }
            
            this.lectureRepo.addOrUpdate(existingLecture);
            return existingLecture;
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật bài giảng: " + e.getMessage());
        }
    }
}

