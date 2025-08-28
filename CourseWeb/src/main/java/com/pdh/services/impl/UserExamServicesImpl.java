package com.pdh.services.impl;

import com.pdh.pojo.UserExam;
import com.pdh.repositories.UserExamRepository;
import com.pdh.services.UserExamServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserExamServicesImpl implements UserExamServices {

    @Autowired
    private UserExamRepository userExamRepository;

    @Override
    public UserExam save(UserExam ue) {
        return userExamRepository.save(ue);
    }

    @Override
    public java.math.BigDecimal findBestScore(int userId, int examId) {
        return userExamRepository.findBestScore(userId, examId);
    }
}


