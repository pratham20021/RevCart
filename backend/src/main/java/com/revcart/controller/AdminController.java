package com.revcart.controller;

import com.revcart.dto.DashboardStatsDTO;
import com.revcart.dto.OrderDTO;
import com.revcart.service.AdminService;
import com.revcart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private OrderService orderService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        try {
            DashboardStatsDTO stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting dashboard stats: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/orders/recent")
    public ResponseEntity<List<OrderDTO>> getRecentOrders() {
        try {
            List<OrderDTO> orders = orderService.getRecentOrdersFormatted();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error getting recent orders: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}