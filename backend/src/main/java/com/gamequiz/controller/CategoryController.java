package com.gamequiz.controller;

import com.gamequiz.dto.CategoryDTO;
import com.gamequiz.mapper.CategoryMapper;
import com.gamequiz.model.Category;
import com.gamequiz.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<CategoryDTO> categoryDTOs = categoryService.getAllCategories()
            .stream()
            .map(categoryMapper::toDTO)
            .collect(Collectors.toList());
            
        Map<String, Object> response = new HashMap<>();
        response.put("categories", categoryDTOs);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            Category category = categoryMapper.toEntity(categoryDTO);
            Category createdCategory = categoryService.createCategory(category);
            CategoryDTO createdDTO = categoryMapper.toDTO(createdCategory);
            
            Map<String, Object> response = new HashMap<>();
            response.put("category", createdDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{name}")
    public ResponseEntity<?> updateCategory(
            @PathVariable String name,
            @RequestBody Map<String, String> update) {
        try {
            Category updatedCategory = categoryService.updateCategory(name, update.get("name"));
            CategoryDTO updatedDTO = categoryMapper.toDTO(updatedCategory);
            
            Map<String, Object> response = new HashMap<>();
            response.put("category", updatedDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteCategory(@PathVariable String name) {
        try {
            categoryService.deleteCategory(name);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
