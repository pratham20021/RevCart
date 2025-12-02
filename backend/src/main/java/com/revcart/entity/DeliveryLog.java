package com.revcart.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "delivery_logs")
public class DeliveryLog {
    @Id
    private String id;
    
    private Long orderId;
    private Long deliveryAgentId;
    private String status;
    private String location;
    private String notes;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    // Constructors
    public DeliveryLog() {}
    
    public DeliveryLog(Long orderId, Long deliveryAgentId, String status, String location) {
        this.orderId = orderId;
        this.deliveryAgentId = deliveryAgentId;
        this.status = status;
        this.location = location;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public Long getDeliveryAgentId() { return deliveryAgentId; }
    public void setDeliveryAgentId(Long deliveryAgentId) { this.deliveryAgentId = deliveryAgentId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}