package com.gamequiz.service;

import com.gamequiz.model.Question;
import com.gamequiz.model.User;
import com.gamequiz.model.UserAnswer;
import com.gamequiz.repository.QuestionRepository;
import com.gamequiz.repository.UserAnswerRepository;
import com.gamequiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class GameService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public Question getRandomQuestion() {
        return questionRepository.findRandomQuestion();
    }

    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }

    public Map<String, Object> submitAnswer(Long userId, Long questionId, String answer) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isCorrect = question.getCorrectAnswer().equals(answer);
        int points = isCorrect ? question.getPoints() : 0;

        // Save user answer
        UserAnswer userAnswer = new UserAnswer();
        userAnswer.setUser(user);
        userAnswer.setQuestion(question);
        userAnswer.setSelectedAnswer(answer);
        userAnswer.setCorrect(isCorrect);
        userAnswer.setPointsEarned(points);
        userAnswerRepository.save(userAnswer);

        // Update user points if answer is correct
        if (isCorrect) {
            userService.updatePoints(userId, points);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("correct", isCorrect);
        result.put("points", points);
        result.put("correctAnswer", question.getCorrectAnswer());

        return result;
    }

    public List<UserAnswer> getUserAnswers(Long userId) {
        return userAnswerRepository.findByUserId(userId);
    }
}
