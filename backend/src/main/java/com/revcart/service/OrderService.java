package com.revcart.service;

import com.revcart.entity.Order;
import com.revcart.entity.OrderItem;
import com.revcart.entity.Product;
import com.revcart.entity.User;
import com.revcart.repository.OrderRepository;
import com.revcart.repository.ProductRepository;
import com.revcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revcart.dto.OrderDTO;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Order createOrder(Map<String, Object> orderData) {
        System.out.println("Creating order with data: " + orderData);
        Order order = new Order();
        
        // Set basic order info
        order.setTotalAmount(new BigDecimal(orderData.get("total").toString()));
        order.setPaymentMethod((String) orderData.get("paymentMethod"));
        order.setCustomerName((String) orderData.get("customerName"));
        order.setCustomerEmail((String) orderData.get("email"));
        order.setCustomerPhone((String) orderData.get("phone"));
        order.setPaymentStatus("COMPLETED");
        order.setOrderStatus(Order.OrderStatus.PLACED);
        
        // Handle address
        if (orderData.get("address") != null) {
            Map<String, String> address = (Map<String, String>) orderData.get("address");
            String fullAddress = String.format("%s, %s, %s", 
                address.get("street"), address.get("city"), address.get("postalCode"));
            order.setDeliveryAddress(fullAddress);
        }
        
        // Find user by email if exists
        if (order.getCustomerEmail() != null) {
            userRepository.findByEmail(order.getCustomerEmail())
                .ifPresent(order::setUser);
        }
        
        // Handle order items
        if (orderData.get("items") != null) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
            for (Map<String, Object> itemData : items) {
                OrderItem orderItem = new OrderItem();
                
                Long productId = Long.valueOf(itemData.get("id").toString());
                Product product = productRepository.findById(productId).orElse(null);
                
                if (product != null) {
                    orderItem.setProduct(product);
                    orderItem.setQuantity(Integer.valueOf(itemData.get("quantity").toString()));
                    orderItem.setPrice(new BigDecimal(itemData.get("price").toString()));
                    order.addOrderItem(orderItem);
                }
            }
        }
        
        Order savedOrder = orderRepository.save(order);
        System.out.println("Order saved successfully with ID: " + savedOrder.getId());
        
        // Send order confirmation notification
        Long userId = savedOrder.getUser() != null ? savedOrder.getUser().getId() : 1L;
        notificationService.createNotification(userId,
            "Order Placed Successfully",
            "Your order #" + savedOrder.getId() + " has been placed successfully",
            "ORDER_PLACED");
        
        return savedOrder;
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return orderRepository.findByUserOrderByCreatedAtDesc(user);
        }
        return List.of();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<OrderDTO> getRecentOrdersFormatted() {
        List<Order> orders = orderRepository.findTop10ByOrderByCreatedAtDesc();
        return orders.stream()
            .map(order -> new OrderDTO(
                order.getId(),
                order.getCustomerName() != null ? order.getCustomerName() : 
                    (order.getUser() != null ? order.getUser().getName() : "Guest"),
                order.getTotalAmount(),
                order.getOrderStatus().toString(),
                order.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }
}