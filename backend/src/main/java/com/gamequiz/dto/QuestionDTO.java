package com.gamequiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private Long id;
    private String title;
    private String text;
    private String category;
    private String difficulty;
    private List<String> options;
    private String correctAnswer;  // Include correctAnswer for admin/designer operations
    private Integer points;
    private String status;
}
