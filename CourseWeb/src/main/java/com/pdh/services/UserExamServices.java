package com.pdh.services;

import com.pdh.pojo.UserExam;

public interface UserExamServices {
    UserExam save(UserExam ue);
    java.math.BigDecimal findBestScore(int userId, int examId);
}


