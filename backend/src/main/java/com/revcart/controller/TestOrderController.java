package com.revcart.controller;

import com.revcart.entity.Order;
import com.revcart.entity.OrderItem;
import com.revcart.entity.Product;
import com.revcart.repository.OrderRepository;
import com.revcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createTestOrder() {
        try {
            Order order = new Order();
            order.setCustomerName("Test Customer");
            order.setCustomerEmail("test@example.com");
            order.setCustomerPhone("1234567890");
            order.setTotalAmount(new BigDecimal("100.00"));
            order.setPaymentStatus("COMPLETED");
            order.setPaymentMethod("card");
            order.setDeliveryAddress("Test Address");

            // Add a test order item if products exist
            Product product = productRepository.findAll().stream().findFirst().orElse(null);
            if (product != null) {
                OrderItem item = new OrderItem();
                item.setProduct(product);
                item.setQuantity(1);
                item.setPrice(new BigDecimal("100.00"));
                order.addOrderItem(item);
            }

            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok("Order created with ID: " + savedOrder.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}