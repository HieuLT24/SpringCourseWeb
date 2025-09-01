package com.pdh.services;

import com.pdh.pojo.Exam;
import com.pdh.dto.exam.ExamDto;
import java.util.List;

public interface ExamServices {
    
    public List<Exam> getExamsByCourseId(int courseId);
    
    public List<ExamDto> getExamsDtoByCourseId(int courseId);
    
    public Exam getExamById(int id);
    
    public ExamDto getExamDtoById(int id);
    
    public void addOrUpdate(Exam exam);
    
    public void deleteExam(int id);
    
    public Exam createExam(Exam exam);
    
    public Exam updateExam(int id, Exam exam);
    
    public boolean isExamActive(int examId);
    
    public boolean canUserTakeExam(int userId, int examId);
}

