package com.pdh.repositories;

import com.pdh.pojo.Lecture;
import java.util.List;

public interface LectureRepository {
    
    public List<Lecture> getLecturesByCourseId(int courseId);
    
    public Lecture getLectureById(int id);
    
    public void addOrUpdate(Lecture lecture);
    
    public void deleteLecture(int id);
}
