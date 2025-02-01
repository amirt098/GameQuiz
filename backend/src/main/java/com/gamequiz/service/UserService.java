package com.gamequiz.service;

import com.gamequiz.model.User;
import com.gamequiz.model.UserAnswer;
import com.gamequiz.model.Question;
import com.gamequiz.repository.UserAnswerRepository;
import com.gamequiz.repository.UserRepository;
import com.gamequiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    if (!user.getEmail().equals(updatedUser.getEmail())) {
                        if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                            throw new RuntimeException("Email already exists");
                        }
                        user.setEmail(updatedUser.getEmail());
                    }
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    return userRepository.save(user);
                });
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void updatePoints(Long userId, Integer points) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setTotalPoints(user.getTotalPoints() + points);
            userRepository.save(user);
        });
    }

    public UserAnswer saveUserAnswer(Long userId, Map<String, Object> answerData) {
        User user = getUserById(userId);

        UserAnswer userAnswer = new UserAnswer();
        userAnswer.setUser(user);
        Long questionId = Long.parseLong(answerData.get("questionId").toString());
        Question question = questionService.getQuestionById(questionId);
        userAnswer.setQuestion(question);
        userAnswer.setSelectedAnswer(answerData.get("selectedAnswer").toString());
        userAnswer.setCorrect((Boolean) answerData.get("isCorrect"));
        if (answerData.get("isCorrect") == "True"){
            user.updateTotalPoints(question.getPoints());
            userRepository.save(user);
        }
        return userAnswerRepository.save(userAnswer);
    }

    public List<UserAnswer> getUserAnswers(Long userId) {
        return userAnswerRepository.findByUserId(userId);
    }
}
