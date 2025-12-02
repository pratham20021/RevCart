package com.revcart.dto;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private long totalProducts;
    private long totalOrders;
    private long totalUsers;
    private BigDecimal totalRevenue;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalProducts, long totalOrders, long totalUsers, BigDecimal totalRevenue) {
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalUsers = totalUsers;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    // Getters and Setters
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}