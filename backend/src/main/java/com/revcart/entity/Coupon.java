package com.revcart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private CouponType type;
    
    private BigDecimal value;
    
    private BigDecimal minOrderAmount;
    
    private boolean active = true;
    
    private boolean firstOrderOnly = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum CouponType {
        FREE_DELIVERY, PERCENTAGE, FIXED_AMOUNT
    }
    
    // Constructors
    public Coupon() {}
    
    public Coupon(String code, String title, String description, CouponType type, BigDecimal value, boolean firstOrderOnly) {
        this.code = code;
        this.title = title;
        this.description = description;
        this.type = type;
        this.value = value;
        this.firstOrderOnly = firstOrderOnly;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public CouponType getType() { return type; }
    public void setType(CouponType type) { this.type = type; }
    
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
    
    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public boolean isFirstOrderOnly() { return firstOrderOnly; }
    public void setFirstOrderOnly(boolean firstOrderOnly) { this.firstOrderOnly = firstOrderOnly; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}