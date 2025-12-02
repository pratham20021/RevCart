package com.revcart.controller;

import com.revcart.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Map<String, Object> paymentOrder = paymentService.createPaymentOrder(orderData);
            return ResponseEntity.ok(paymentOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment order creation failed: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> paymentData) {
        try {
            boolean isValid = paymentService.verifyPayment(paymentData);
            if (isValid) {
                paymentService.updateOrderPaymentStatus(paymentData.get("orderId"), "COMPLETED");
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Payment verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
        }
    }

    @PostMapping("/cod")
    public ResponseEntity<?> processCOD(@RequestBody Map<String, Object> orderData) {
        try {
            Map<String, Object> result = paymentService.processCODPayment(orderData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("COD processing failed: " + e.getMessage());
        }
    }
}