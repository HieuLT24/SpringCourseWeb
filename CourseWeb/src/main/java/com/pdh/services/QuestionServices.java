package com.pdh.services;

import com.pdh.pojo.Question;
import com.pdh.dto.exam.QuestionDto;
import java.util.List;
import java.util.Map;

public interface QuestionServices {
    List<Question> getQuestionsByExamId(int examId);
    
    List<QuestionDto> getQuestionsDtoByExamId(int examId);
    
    Question getQuestionById(int id);
    
    QuestionDto getQuestionDtoById(int id);
    
    Question createQuestion(Question question);
    
    Question updateQuestion(int id, Question question);
    
    void deleteQuestion(int id);
    
    List<Question> getQuestionsByExamIdWithAnswers(int examId);
    
    Map<String, Object> getQuestionsByExamIdWithPagination(int examId, int page, int limit);
}


