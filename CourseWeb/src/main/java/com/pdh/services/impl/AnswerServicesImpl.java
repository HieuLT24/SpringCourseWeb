package com.pdh.services.impl;

import com.pdh.pojo.Answer;
import com.pdh.dto.exam.AnswerDto;
import com.pdh.repositories.AnswerRepository;
import com.pdh.services.AnswerServices;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnswerServicesImpl implements AnswerServices {

    @Autowired
    private AnswerRepository answerRepo;

    @Override
    public List<Answer> getAnswersByQuestionId(int questionId) {
        return this.answerRepo.getAnswersByQuestionId(questionId);
    }
    
    @Override
    public List<AnswerDto> getAnswersDtoByQuestionId(int questionId) {
        List<Answer> answers = this.answerRepo.getAnswersByQuestionId(questionId);
        return answers.stream()
                .map(AnswerDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public Answer getAnswerById(int id) {
        return this.answerRepo.getAnswerById(id);
    }
    
    @Override
    public AnswerDto getAnswerDtoById(int id) {
        Answer answer = this.answerRepo.getAnswerById(id);
        return answer != null ? new AnswerDto(answer) : null;
    }
    
    @Override
    public Answer createAnswer(Answer answer) {
        this.answerRepo.addOrUpdate(answer);
        return answer;
    }
    
    @Override
    public Answer updateAnswer(int id, Answer answer) {
        Answer existingAnswer = this.answerRepo.getAnswerById(id);
        if (existingAnswer == null) {
            throw new RuntimeException("Không tìm thấy đáp án");
        }
        
        existingAnswer.setContent(answer.getContent());
        existingAnswer.setIsTrue(answer.getIsTrue());
        // existingAnswer.setExplanation(answer.getExplanation());
        
        this.answerRepo.addOrUpdate(existingAnswer);
        return existingAnswer;
    }
    
    @Override
    public void deleteAnswer(int id) {
        this.answerRepo.deleteAnswer(id);
    }
    
    @Override
    public void deleteAnswersByQuestionId(int questionId) {
        this.answerRepo.deleteAnswersByQuestionId(questionId);
    }
}

