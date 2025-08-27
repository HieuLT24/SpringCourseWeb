package com.pdh.services.impl;

import com.pdh.pojo.Lecture;
import com.pdh.repositories.LectureRepository;
import com.pdh.services.LectureServices;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LectureServicesImpl implements LectureServices {
    
    @Autowired
    private LectureRepository lectureRepo;
    
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
}

