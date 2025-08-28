package com.pdh.repositories;

import com.pdh.pojo.UserExam;

public interface UserExamRepository {
    UserExam save(UserExam ue);
    java.math.BigDecimal findBestScore(int userId, int examId);
}


