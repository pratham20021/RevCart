package com.revcart.service;

import com.revcart.entity.Order;
import com.revcart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    // Mock Razorpay Integration
    public Map<String, Object> createPaymentOrder(Map<String, Object> orderData) {
        try {
            // Mock Razorpay order creation
            String paymentOrderId = "order_" + UUID.randomUUID().toString().substring(0, 8);
            BigDecimal amount = new BigDecimal(orderData.get("amount").toString());
            
            Map<String, Object> paymentOrder = new HashMap<>();
            paymentOrder.put("id", paymentOrderId);
            paymentOrder.put("amount", amount.multiply(new BigDecimal("100"))); // Razorpay expects paise
            paymentOrder.put("currency", "INR");
            paymentOrder.put("key", "rzp_test_mock_key"); // Mock key
            
            return paymentOrder;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        }
    }

    public boolean verifyPayment(Map<String, String> paymentData) {
        try {
            // Mock payment verification - In real implementation, verify with Razorpay
            String paymentId = paymentData.get("paymentId");
            String orderId = paymentData.get("orderId");
            String signature = paymentData.get("signature");
            
            // Mock verification logic
            boolean isValid = paymentId != null && orderId != null && signature != null;
            
            if (isValid) {
                // Send payment success notification
                Long userId = Long.valueOf(paymentData.getOrDefault("userId", "1"));
                notificationService.createNotification(userId, 
                    "Payment Successful", 
                    "Your payment has been processed successfully", 
                    "PAYMENT_SUCCESS");
            }
            
            return isValid;
        } catch (Exception e) {
            return false;
        }
    }

    public void updateOrderPaymentStatus(String orderId, String status) {
        try {
            // Find order by external order ID or internal ID
            // For simplicity, assuming orderId is the internal ID
            Long orderIdLong = Long.valueOf(orderId);
            Order order = orderRepository.findById(orderIdLong).orElse(null);
            
            if (order != null) {
                order.setPaymentStatus(status);
                orderRepository.save(order);
                
                // Send order confirmation notification
                if ("COMPLETED".equals(status)) {
                    notificationService.createNotification(order.getUser() != null ? order.getUser().getId() : 1L,
                        "Order Confirmed", 
                        "Your order #" + order.getId() + " has been confirmed", 
                        "ORDER_PLACED");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update payment status: " + e.getMessage());
        }
    }

    public Map<String, Object> processCODPayment(Map<String, Object> orderData) {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("paymentMethod", "COD");
            result.put("message", "Cash on Delivery order placed successfully");
            
            // Send COD confirmation notification
            Long userId = Long.valueOf(orderData.getOrDefault("userId", "1").toString());
            notificationService.createNotification(userId,
                "COD Order Placed", 
                "Your Cash on Delivery order has been placed successfully", 
                "ORDER_PLACED");
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process COD payment: " + e.getMessage());
        }
    }
}