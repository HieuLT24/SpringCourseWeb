package com.pdh.services;

import com.pdh.pojo.Answer;
import com.pdh.dto.exam.AnswerDto;
import java.util.List;

public interface AnswerServices {
    List<Answer> getAnswersByQuestionId(int questionId);
    
    List<AnswerDto> getAnswersDtoByQuestionId(int questionId);
    
    Answer getAnswerById(int id);
    
    AnswerDto getAnswerDtoById(int id);
    
    Answer createAnswer(Answer answer);
    
    Answer updateAnswer(int id, Answer answer);
    
    void deleteAnswer(int id);
    
    void deleteAnswersByQuestionId(int questionId);
}

