package com.pdh.dto.exam;

import com.pdh.pojo.Exam;
import com.pdh.pojo.Question;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class ExamDto {
    private Integer id;
    private String title;
    private String description;
    private String type;
    private Date startDate;
    private Date endDate;
    private Boolean isActive;
    private Integer courseId;
    private Integer durationMinutes;
    private List<QuestionDto> questions;
    private Integer totalQuestions;
    private Integer totalPoints;

    public ExamDto() {
    }

    public ExamDto(Exam exam) {
        this.id = exam.getId();
        this.title = exam.getTitle();
        this.description = exam.getDescription();
        this.type = exam.getType();
        this.startDate = exam.getStartDate();
        this.endDate = exam.getEndDate();
        this.isActive = exam.getIsActive();
        this.courseId = exam.getCourseId() != null ? exam.getCourseId().getId() : null;
        this.durationMinutes = exam.getDurationMinutes();
        
        if (exam.getQuestionSet() != null) {
            this.questions = exam.getQuestionSet().stream()
                    .map(QuestionDto::new)
                    .collect(Collectors.toList());
            this.totalQuestions = this.questions.size();
            this.totalPoints = this.questions.stream()
                    .mapToInt(q -> q.getPoints() != null ? q.getPoints() : 0)
                    .sum();
        }
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }
}

