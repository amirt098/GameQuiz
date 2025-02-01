package com.gamequiz.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String text;
    private String category;
    private String difficulty;
    
    @ElementCollection
    private List<String> options;
    
    private String correctAnswer;
    private Integer points;
    private String status = "active";
}
