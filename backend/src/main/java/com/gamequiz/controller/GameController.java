package com.gamequiz.controller;

import com.gamequiz.dto.AnswerSubmissionDTO;
import com.gamequiz.model.Question;
import com.gamequiz.model.User;
import com.gamequiz.model.UserAnswer;
import com.gamequiz.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody AnswerSubmissionDTO submission) {
        try {
            Map<String, Object> result = gameService.submitAnswer(submission.getUserId(), submission.getQuestionId(), submission.getSelectedAnswer());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
