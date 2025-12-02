package com.revcart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderDTO {
    private String orderId;
    private String customerName;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Long id, String customerName, BigDecimal amount, String status, LocalDateTime createdAt) {
        this.orderId = "#RC" + String.format("%06d", id);
        this.customerName = customerName;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}