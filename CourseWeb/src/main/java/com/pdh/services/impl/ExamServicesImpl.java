package com.pdh.services.impl;

import com.pdh.pojo.Exam;
import com.pdh.pojo.Course;
import com.pdh.pojo.User;
import com.pdh.dto.exam.ExamDto;
import com.pdh.repositories.ExamRepository;
import com.pdh.repositories.CourseRepository;
import com.pdh.repositories.UserRepository;
import com.pdh.services.ExamServices;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExamServicesImpl implements ExamServices {
    
    @Autowired
    private ExamRepository examRepo;
    
    @Autowired
    private CourseRepository courseRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    @Override
    public List<Exam> getExamsByCourseId(int courseId) {
        return this.examRepo.getExamsByCourseId(courseId);
    }
    
    @Override
    public List<ExamDto> getExamsDtoByCourseId(int courseId) {
        List<Exam> exams = this.examRepo.getExamsByCourseId(courseId);
        return exams.stream()
                .map(ExamDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public Exam getExamById(int id) {
        return this.examRepo.getExamById(id);
    }
    
    @Override
    public ExamDto getExamDtoById(int id) {
        Exam exam = this.examRepo.getExamById(id);
        return exam != null ? new ExamDto(exam) : null;
    }
    
    @Override
    public void addOrUpdate(Exam exam) {
        this.examRepo.addOrUpdate(exam);
    }
    
    @Override
    public void deleteExam(int id) {
        this.examRepo.deleteExam(id);
    }
    
    @Override
    public Exam createExam(Exam exam) {
        if (exam.getIsActive() == null) {
            exam.setIsActive(true);
        }
        this.examRepo.addOrUpdate(exam);
        return exam;
    }
    
    @Override
    public Exam updateExam(int id, Exam exam) {
        try {
            // Lấy exam hiện tại để có courseId và các thông tin liên quan
            Exam existingExam = this.examRepo.getExamById(id);
            if (existingExam == null) {
                throw new RuntimeException("Không tìm thấy bài kiểm tra với ID: " + id);
            }
            
            // Cập nhật các trường
            existingExam.setTitle(exam.getTitle());
            existingExam.setDescription(exam.getDescription());
            existingExam.setType(exam.getType());
            existingExam.setStartDate(exam.getStartDate());
            existingExam.setEndDate(exam.getEndDate());
            existingExam.setIsActive(exam.getIsActive());
            existingExam.setDurationMinutes(exam.getDurationMinutes());
            
            // Lưu thay đổi
            this.examRepo.addOrUpdate(existingExam);
            
            // Trả về exam đã được cập nhật
            return this.examRepo.getExamById(id);
            
        } catch (Exception e) {
            throw new RuntimeException("Không thể cập nhật bài kiểm tra: " + e.getMessage());
        }
    }
    
    @Override
    public boolean isExamActive(int examId) {
        Exam exam = this.examRepo.getExamById(examId);
        if (exam == null || !exam.getIsActive()) {
            return false;
        }
        
        Date now = new Date();
        return (exam.getStartDate() == null || now.after(exam.getStartDate())) &&
               (exam.getEndDate() == null || now.before(exam.getEndDate()));
    }
    
    @Override
    public boolean canUserTakeExam(int userId, int examId) {
        Exam exam = this.examRepo.getExamById(examId);
        if (exam == null || !isExamActive(examId)) {
            return false;
        }
        
        // Kiểm tra xem user có đăng ký khóa học không
        Course course = exam.getCourseId();
        if (course == null) {
            return false;
        }
        
        // TODO: Thêm logic kiểm tra enrollment
        return true;
    }
}

