package com.pdh.repositories;

import com.pdh.pojo.Question;
import java.util.List;
import java.util.Map;

public interface QuestionRepository {
    List<Question> getQuestionsByExamId(int examId);
    
    List<Question> getQuestionsByExamIdWithAnswers(int examId);
    
    Question getQuestionById(int id);
    
    void addOrUpdate(Question question);
    
    void deleteQuestion(int id);
    
    Map<String, Object> getQuestionsByExamIdWithPagination(int examId, int page, int limit);
}


