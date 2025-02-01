package com.gamequiz.controller;

import com.gamequiz.dto.QuestionDTO;
import com.gamequiz.mapper.QuestionMapper;
import com.gamequiz.model.Question;
import com.gamequiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionMapper questionMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String status) {
        List<QuestionDTO> questions = questionService.getQuestionsByFilters(category, difficulty, status);
        Map<String, Object> response = new HashMap<>();
        response.put("questions", questions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/random")
    public ResponseEntity<Map<String, Object>> getRandomQuestion() {
        QuestionDTO question = questionService.getRandomQuestion();
        if (question == null) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("question", question);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/random/unanswered/{userId}")
    public ResponseEntity<QuestionDTO> getRandomUnansweredQuestion(@PathVariable Long userId) {
        QuestionDTO question = questionService.getRandomUnansweredQuestion(userId);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(question);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getQuestionsByCategory(@PathVariable String category) {
        List<QuestionDTO> questions = questionService.getQuestionsByCategory(category);
        Map<String, Object> response = new HashMap<>();
        response.put("questions", questions);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createQuestion(@RequestBody QuestionDTO questionDTO) {
        Question question = questionMapper.toEntity(questionDTO);
        QuestionDTO createdQuestion = questionService.createQuestion(question);
        Map<String, Object> response = new HashMap<>();
        response.put("question", createdQuestion);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        Question question = questionMapper.toEntity(questionDTO);
        QuestionDTO updatedQuestion = questionService.updateQuestion(id, question);
        if (updatedQuestion == null) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("question", updatedQuestion);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{questionId}/submit")
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @PathVariable Long questionId,
            @RequestBody Map<String, String> submission) {
        String submittedAnswer = submission.get("answer");
        Map<String, Object> result = questionService.submitAnswer(questionId, submittedAnswer);
        return ResponseEntity.ok(result);
    }
}
