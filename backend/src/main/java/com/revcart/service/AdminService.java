package com.revcart.service;

import com.revcart.dto.DashboardStatsDTO;
import com.revcart.repository.OrderRepository;
import com.revcart.repository.ProductRepository;
import com.revcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AdminService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();

        return new DashboardStatsDTO(totalProducts, totalOrders, totalUsers, totalRevenue);
    }
}