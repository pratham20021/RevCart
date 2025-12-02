package com.revcart.repository;

import com.revcart.entity.Order;
import com.revcart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByOrderStatusOrderByCreatedAtDesc(Order.OrderStatus status);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'COMPLETED'")
    BigDecimal getTotalRevenue();
    
    List<Order> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(o) FROM Order o")
    long getTotalOrdersCount();
    
    @Query("SELECT o FROM Order o WHERE o.orderStatus IN ('PLACED', 'PACKED', 'OUT_FOR_DELIVERY') ORDER BY o.createdAt DESC")
    List<Order> findActiveOrders();
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders();
}