package com.revcart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;
    
    @Column(nullable = false, name = "initial_stock")
    private Integer initialStock = 0;
    
    @Column(nullable = false, name = "current_stock")
    private Integer currentStock = 0;
    
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(nullable = false)
    private String category;
    
    private String brand;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("4.5");
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (stock == null || stock == 0) {
            stock = currentStock != null ? currentStock : 0;
        }
        if (currentStock == null || currentStock == 0) {
            currentStock = initialStock != null ? initialStock : 0;
        }
        if (rating == null) {
            rating = new BigDecimal("4.5");
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(BigDecimal discountPrice) { this.discountPrice = discountPrice; }
    
    public Integer getInitialStock() { return initialStock; }
    public void setInitialStock(Integer initialStock) { 
        this.initialStock = initialStock;
        if (this.currentStock == null || this.currentStock == 0) {
            this.currentStock = initialStock;
        }
        if (this.stock == null || this.stock == 0) {
            this.stock = initialStock;
        }
    }
    
    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { 
        this.currentStock = currentStock;
        if (this.stock == null || this.stock == 0) {
            this.stock = currentStock;
        }
    }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { 
        this.stock = stock;
        if (this.currentStock == null || this.currentStock == 0) {
            this.currentStock = stock;
        }
    }
    
    public boolean isInStock() { return currentStock != null && currentStock > 0; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}