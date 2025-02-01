package com.gamequiz.controller;

import com.gamequiz.model.User;
import com.gamequiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String emailOrUsername = credentials.get("emailOrUsername");
            String password = credentials.get("password");
            
            if (emailOrUsername == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email/username and password are required"));
            }

            // Try to find user by email or username
            Optional<User> userOptional = userRepository.findByEmail(emailOrUsername);
            if (userOptional.isEmpty()) {
                userOptional = userRepository.findByUsername(emailOrUsername);
            }

            if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {
                User user = userOptional.get();
                Map<String, Object> response = new HashMap<>();
                String token = "mock-jwt-token-" + user.getId();
                response.put("token", token);
                response.put("user", user);
                return ResponseEntity.ok()
                        .header("Authorization", "Bearer " + token)
                        .body(response);
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String email = userData.get("email");
            String password = userData.get("password");
            String name = userData.get("name");
            String role = userData.get("role");

            // Validation
            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username, email and password are required"));
            }

            // Check if username or email already exists
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            // Create new user
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setName(name != null ? name : username);
            user.setRole(role != null ? role : "player");
            user.setTotalPoints(0);

            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            String token = "mock-jwt-token-" + savedUser.getId();
            response.put("token", token);
            response.put("user", savedUser);
            
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
