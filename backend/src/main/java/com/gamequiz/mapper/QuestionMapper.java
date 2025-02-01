package com.gamequiz.mapper;

import com.gamequiz.dto.QuestionDTO;
import com.gamequiz.model.Question;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {
    
    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            return null;
        }
        
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setText(question.getText());
        dto.setCategory(question.getCategory());
        dto.setDifficulty(question.getDifficulty());
        dto.setOptions(question.getOptions());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setPoints(question.getPoints());
        dto.setStatus(question.getStatus());
        return dto;
    }
    
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Question question = new Question();
        question.setId(dto.getId());
        question.setTitle(dto.getTitle());
        question.setText(dto.getText());
        question.setCategory(dto.getCategory());
        question.setDifficulty(dto.getDifficulty());
        question.setOptions(dto.getOptions());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setPoints(dto.getPoints());
        question.setStatus(dto.getStatus());
        return question;
    }
}
