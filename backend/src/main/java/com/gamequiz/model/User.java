package com.gamequiz.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;        // Full name for display, not unique
    
    @Column(unique = true)
    private String username;    // Unique username for identification
    
    @Column(unique = true)
    private String email;
    
    private String password;
    private String role = "player";  // Added role field
    private Integer totalPoints = 0;

    public void updateTotalPoints(int point){
        this.totalPoints = this.totalPoints + point;
    }
}
