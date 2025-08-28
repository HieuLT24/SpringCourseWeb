package com.pdh.repositories;

import com.pdh.pojo.Question;
import java.util.List;

public interface QuestionRepository {
    List<Question> getQuestionsByExamId(int examId);
}


