package com.gamequiz.service;

import com.gamequiz.dto.QuestionDTO;
import com.gamequiz.model.Question;
import com.gamequiz.model.UserAnswer;
import com.gamequiz.repository.QuestionRepository;
import com.gamequiz.repository.UserAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;

    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<QuestionDTO> getQuestionsByFilters(String category, String difficulty, String status) {
        List<Question> questions;
        if (category != null && difficulty != null && status != null) {
            questions = questionRepository.findByCategoryAndDifficultyAndStatus(category, difficulty, status);
        } else if (category != null) {
            questions = questionRepository.findByCategory(category);
        } else if (difficulty != null) {
            questions = questionRepository.findByDifficulty(difficulty);
        } else {
            questions = questionRepository.findAll();
        }
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public QuestionDTO getRandomQuestion() {
        Question question = questionRepository.findRandomQuestion();
        return question != null ? convertToDTO(question) : null;
    }

    public List<QuestionDTO> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public QuestionDTO createQuestion(Question question) {
        Question savedQuestion = questionRepository.save(question);
        return convertToDTO(savedQuestion);
    }

    public QuestionDTO updateQuestion(Long id, Question updatedQuestion) {
        return questionRepository.findById(id)
                .map(existingQuestion -> {
                    existingQuestion.setTitle(updatedQuestion.getTitle());
                    existingQuestion.setText(updatedQuestion.getText());
                    existingQuestion.setCategory(updatedQuestion.getCategory());
                    existingQuestion.setDifficulty(updatedQuestion.getDifficulty());
                    existingQuestion.setOptions(updatedQuestion.getOptions());
                    existingQuestion.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
                    existingQuestion.setPoints(updatedQuestion.getPoints());
                    existingQuestion.setStatus(updatedQuestion.getStatus());
                    return convertToDTO(questionRepository.save(existingQuestion));
                })
                .orElse(null);
    }

    public QuestionDTO getRandomUnansweredQuestion(Long userId) {
        // Get all questions
        List<Question> allQuestions = questionRepository.findAll();
        if (allQuestions.isEmpty()) {
            return null;
        }

        // Get answered question IDs for this user
        Set<Long> answeredQuestionIds = userAnswerRepository.findByUserId(userId).stream()
                .map(answer -> answer.getQuestion().getId())
                .collect(Collectors.toSet());

        // Filter out answered questions
        List<Question> unansweredQuestions = allQuestions.stream()
                .filter(q -> !answeredQuestionIds.contains(q.getId()))
                .collect(Collectors.toList());

        if (unansweredQuestions.isEmpty()) {
            return null;
        }

        // Get a random question from the unanswered ones
        int randomIndex = (int) (Math.random() * unansweredQuestions.size());
        return convertToDTO(unansweredQuestions.get(randomIndex));
    }

    public Map<String, Object> submitAnswer(Long questionId, String submittedAnswer) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        boolean isCorrect = question.getCorrectAnswer().equals(submittedAnswer);
        int points = isCorrect ? question.getPoints() : 0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("correct", isCorrect);
        response.put("points", points);
        response.put("correctAnswer", question.getCorrectAnswer());
        
        return response;
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }

    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setText(question.getText());
        dto.setCategory(question.getCategory());
        dto.setDifficulty(question.getDifficulty());
        dto.setOptions(question.getOptions());
        dto.setPoints(question.getPoints());
        dto.setStatus(question.getStatus());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        return dto;
    }
}
