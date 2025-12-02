package com.revcart.controller;

import com.revcart.entity.Order;
import com.revcart.dto.OrderDTO;
import com.revcart.service.OrderService;
import com.revcart.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            System.out.println("Creating order with data: " + orderData);
            Order savedOrder = orderService.createOrder(orderData);
            System.out.println("Order saved with ID: " + savedOrder.getId());
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            List<Order> orders = orderService.getUserOrders(userPrincipal.getEmail());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<OrderDTO>> getRecentOrders() {
        try {
            List<OrderDTO> orders = orderService.getRecentOrdersFormatted();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error getting recent orders: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            System.out.println("Found " + orders.size() + " orders");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error getting orders: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}