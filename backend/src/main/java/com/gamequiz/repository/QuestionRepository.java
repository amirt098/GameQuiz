package com.gamequiz.repository;

import com.gamequiz.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategory(String category);
    List<Question> findByDifficulty(String difficulty);
    
    @Query(value = "SELECT * FROM questions WHERE status = 'active' ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Question findRandomQuestion();
    
    List<Question> findByCategoryAndDifficultyAndStatus(String category, String difficulty, String status);
}
