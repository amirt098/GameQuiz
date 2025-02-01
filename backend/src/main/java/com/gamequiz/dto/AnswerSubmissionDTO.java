package com.gamequiz.dto;

import lombok.Data;

@Data
public class AnswerSubmissionDTO {
    private Long questionId;
    private String selectedAnswer;
    private Long userId;
}
