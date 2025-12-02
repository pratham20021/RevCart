package com.revcart.config;

import com.revcart.entity.Product;
import com.revcart.entity.User;
import com.revcart.repository.ProductRepository;
import com.revcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize demo users if they don't exist
        if (!userRepository.existsByEmail("customer@demo.com")) {
            User customer = new User();
            customer.setName("Demo Customer");
            customer.setEmail("customer@demo.com");
            customer.setPassword(passwordEncoder.encode("password123"));
            customer.setRole(User.Role.CUSTOMER);
            customer.setPhone("9876543210");
            customer.setAddress("123 Demo Street, Demo City");
            userRepository.save(customer);
        }
        
        if (!userRepository.existsByEmail("admin@demo.com")) {
            User admin = new User();
            admin.setName("Demo Admin");
            admin.setEmail("admin@demo.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole(User.Role.ADMIN);
            admin.setPhone("9876543211");
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByEmail("delivery@demo.com")) {
            User delivery = new User();
            delivery.setName("Demo Delivery Agent");
            delivery.setEmail("delivery@demo.com");
            delivery.setPassword(passwordEncoder.encode("password123"));
            delivery.setRole(User.Role.DELIVERY_AGENT);
            delivery.setPhone("9876543212");
            userRepository.save(delivery);
        }
        
        // Initialize sample products if none exist
        if (productRepository.count() == 0) {
            createSampleProducts();
        }
    }
    
    private void createSampleProducts() {
        Product[] products = {
            createProduct("Organic Bananas", "Fresh organic bananas from local farms", 
                         new BigDecimal("45.00"), new BigDecimal("60.00"), "Fruits & Vegetables", 
                         "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop", 100),
            
            createProduct("Fresh Apples", "Crispy red apples perfect for snacking", 
                         new BigDecimal("120.00"), new BigDecimal("150.00"), "Fruits & Vegetables", 
                         "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop", 80),
            
            createProduct("Premium Milk", "Fresh whole milk from grass-fed cows", 
                         new BigDecimal("65.00"), null, "Dairy & Eggs", 
                         "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop", 50),
            
            createProduct("Farm Eggs", "Free-range eggs from happy chickens", 
                         new BigDecimal("80.00"), new BigDecimal("95.00"), "Dairy & Eggs", 
                         "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop", 60),
            
            createProduct("Whole Wheat Bread", "Freshly baked whole wheat bread", 
                         new BigDecimal("40.00"), null, "Bakery", 
                         "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", 30),
            
            createProduct("Greek Yogurt", "Creamy Greek yogurt with probiotics", 
                         new BigDecimal("85.00"), new BigDecimal("100.00"), "Dairy & Eggs", 
                         "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", 40)
        };
        
        for (Product product : products) {
            productRepository.save(product);
        }
    }
    
    private Product createProduct(String name, String description, BigDecimal price, 
                                 BigDecimal originalPrice, String category, String imageUrl, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setDiscountPrice(originalPrice);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setInitialStock(stock);
        product.setCurrentStock(stock);
        product.setRating(new BigDecimal("4.5"));
        return product;
    }
}