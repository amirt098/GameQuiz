package com.gamequiz.service;

import com.gamequiz.model.Category;
import com.gamequiz.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()) != null) {
            throw new RuntimeException("Category already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(String oldName, String newName) {
        Category category = categoryRepository.findByName(oldName);
        if (category == null) {
            throw new RuntimeException("Category not found");
        }
        
        if (!oldName.equals(newName) && categoryRepository.findByName(newName) != null) {
            throw new RuntimeException("New category name already exists");
        }
        
        category.setName(newName);
        return categoryRepository.save(category);
    }

    public void deleteCategory(String name) {
        Category category = categoryRepository.findByName(name);
        if (category == null) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.delete(category);
    }

    public Category findByName(String name) {
        return categoryRepository.findByName(name);
    }
}
