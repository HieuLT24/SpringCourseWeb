package com.pdh.services;

import com.pdh.pojo.Question;
import java.util.List;

public interface QuestionServices {
    List<Question> getQuestionsByExamId(int examId);
}


