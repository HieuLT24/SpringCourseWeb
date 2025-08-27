package com.pdh.services;

import com.pdh.pojo.Exam;
import java.util.List;

public interface ExamServices {
    
    public List<Exam> getExamsByCourseId(int courseId);
    
    public Exam getExamById(int id);
    
    public void addOrUpdate(Exam exam);
    
    public void deleteExam(int id);
}

