package com.pdh.dto.exam;

import com.pdh.pojo.Answer;

public class AnswerDto {
    private Integer id;
    private String content;
    private Short isTrue;
    private Integer questionId;

    public AnswerDto() {
    }

    public AnswerDto(Answer answer) {
        this.id = answer.getId();
        this.content = answer.getContent();
        this.isTrue = answer.getIsTrue();
        this.questionId = answer.getQuestionId() != null ? answer.getQuestionId().getId() : null;
    }

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

    public Short getIsTrue() {
        return isTrue;
    }

    public void setIsTrue(Short isTrue) {
        this.isTrue = isTrue;
    }


    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }
}

