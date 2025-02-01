package com.gamequiz.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_answers")
public class UserAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Question question;
    
    private String selectedAnswer;
    private boolean correct;
    private Integer pointsEarned;
    private LocalDateTime answeredAt = LocalDateTime.now();
}
