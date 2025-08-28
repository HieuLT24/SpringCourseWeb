package com.pdh.services.impl;

import com.pdh.pojo.Question;
import com.pdh.repositories.QuestionRepository;
import com.pdh.services.QuestionServices;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionServicesImpl implements QuestionServices {

    @Autowired
    private QuestionRepository questionRepo;

    @Override
    public List<Question> getQuestionsByExamId(int examId) {
        return this.questionRepo.getQuestionsByExamId(examId);
    }
}


