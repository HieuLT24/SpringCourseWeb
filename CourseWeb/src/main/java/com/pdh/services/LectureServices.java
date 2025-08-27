package com.pdh.services;

import com.pdh.pojo.Lecture;
import java.util.List;

public interface LectureServices {
    
    public List<Lecture> getLecturesByCourseId(int courseId);
    
    public Lecture getLectureById(int id);
    
    public void addOrUpdate(Lecture lecture);
    
    public void deleteLecture(int id);
}

