package com.pdh.services.impl;

import com.pdh.pojo.Exam;
import com.pdh.repositories.ExamRepository;
import com.pdh.services.ExamServices;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExamServicesImpl implements ExamServices {
    
    @Autowired
    private ExamRepository examRepo;
    
    @Override
    public List<Exam> getExamsByCourseId(int courseId) {
        return this.examRepo.getExamsByCourseId(courseId);
    }
    
    @Override
    public Exam getExamById(int id) {
        return this.examRepo.getExamById(id);
    }
    
    @Override
    public void addOrUpdate(Exam exam) {
        this.examRepo.addOrUpdate(exam);
    }
    
    @Override
    public void deleteExam(int id) {
        this.examRepo.deleteExam(id);
    }
}

