package com.gamequiz.controller;

import com.gamequiz.model.User;
import com.gamequiz.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getLeaderboard() {
        try {
            List<User> users = leaderboardService.getLeaderboard();
            Map<String, Object> response = new HashMap<>();
            response.put("players", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch leaderboard");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/top/{limit}")
    public ResponseEntity<Map<String, Object>> getTopPlayers(@PathVariable int limit) {
        try {
            List<User> users = leaderboardService.getTopPlayers(limit);
            Map<String, Object> response = new HashMap<>();
            response.put("players", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch top players");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
