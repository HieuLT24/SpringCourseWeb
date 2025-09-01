package com.pdh.repositories;

import com.pdh.pojo.Answer;
import java.util.List;

public interface AnswerRepository {
    List<Answer> getAnswersByQuestionId(int questionId);
    
    Answer getAnswerById(int id);
    
    void addOrUpdate(Answer answer);
    
    void deleteAnswer(int id);
    
    void deleteAnswersByQuestionId(int questionId);
}

