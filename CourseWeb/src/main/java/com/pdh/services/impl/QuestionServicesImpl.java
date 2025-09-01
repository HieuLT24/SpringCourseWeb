package com.pdh.services.impl;

import com.pdh.pojo.Question;
import com.pdh.dto.exam.QuestionDto;
import com.pdh.repositories.QuestionRepository;
import com.pdh.services.QuestionServices;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
    
    @Override
    public List<QuestionDto> getQuestionsDtoByExamId(int examId) {
        List<Question> questions = this.questionRepo.getQuestionsByExamId(examId);
        return questions.stream()
                .map(QuestionDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public Question getQuestionById(int id) {
        return this.questionRepo.getQuestionById(id);
    }
    
    @Override
    public QuestionDto getQuestionDtoById(int id) {
        Question question = this.questionRepo.getQuestionById(id);
        return question != null ? new QuestionDto(question) : null;
    }
    
    @Override
    public Question createQuestion(Question question) {
        
        this.questionRepo.addOrUpdate(question);
        return question;
    }
    
    @Override
    public Question updateQuestion(int id, Question question) {
        Question existingQuestion = this.questionRepo.getQuestionById(id);
        if (existingQuestion == null) {
            throw new RuntimeException("Không tìm thấy câu hỏi");
        }
        
        existingQuestion.setContent(question.getContent());
        existingQuestion.setPoints(question.getPoints());
        this.questionRepo.addOrUpdate(existingQuestion);
        return existingQuestion;
    }
    
    @Override
    public void deleteQuestion(int id) {
        this.questionRepo.deleteQuestion(id);
    }
    
    @Override
    public List<Question> getQuestionsByExamIdWithAnswers(int examId) {
        return this.questionRepo.getQuestionsByExamIdWithAnswers(examId);
    }
    
    @Override
    public Map<String, Object> getQuestionsByExamIdWithPagination(int examId, int page, int limit) {
        return this.questionRepo.getQuestionsByExamIdWithPagination(examId, page, limit);
    }
}


