package com.pdh.dto.exam;

import com.pdh.pojo.Question;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionDto {
    private Integer id;
    private String content;
    private Integer points;
    private Integer examId;
    private List<AnswerDto> answers;

    public QuestionDto() {
    }

    public QuestionDto(Question question) {
        this.id = question.getId();
        this.content = question.getContent();
        this.points = question.getPoints();
        this.examId = question.getExamId() != null ? question.getExamId().getId() : null;
        
        if (question.getAnswerSet() != null) {
            this.answers = question.getAnswerSet().stream()
                    .map(AnswerDto::new)
                    .collect(Collectors.toList());
        }
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

    public List<AnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDto> answers) {
        this.answers = answers;
    }
}

