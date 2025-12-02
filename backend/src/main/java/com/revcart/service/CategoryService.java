package com.revcart.service;

import com.revcart.entity.Category;
import com.revcart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getAllActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }
    
    public Category createCategory(String name, String description) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category with name '" + name + "' already exists");
        }
        
        Category category = new Category(name, description);
        return categoryRepository.save(category);
    }
    
    public void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Fruits & Vegetables", "Fresh fruits and vegetables"));
            categoryRepository.save(new Category("Dairy & Eggs", "Milk, cheese, eggs and dairy products"));
            categoryRepository.save(new Category("Meat & Seafood", "Fresh meat and seafood"));
            categoryRepository.save(new Category("Beverages", "Drinks and beverages"));
            categoryRepository.save(new Category("Snacks", "Snacks and quick bites"));
            categoryRepository.save(new Category("Bakery", "Bread, cakes and bakery items"));
            categoryRepository.save(new Category("Frozen Foods", "Frozen and preserved foods"));
        }
    }
}