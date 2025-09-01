package com.pdh.services;

import com.pdh.pojo.Lecture;
import com.pdh.dto.lecture.LectureRequest;
import java.util.List;

public interface LectureServices {
    
    public List<Lecture> getLecturesByCourseId(int courseId);
    
    public Lecture getLectureById(int id);
    
    public void addOrUpdate(Lecture lecture);
    
    public void deleteLecture(int id);
    
    public Lecture createLecture(LectureRequest request);
    
    public Lecture updateLecture(int lectureId, LectureRequest request);
}

