package com.revcart.repository;

import com.revcart.entity.DeliveryLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryLogRepository extends MongoRepository<DeliveryLog, String> {
    List<DeliveryLog> findByOrderIdOrderByTimestampDesc(Long orderId);
    List<DeliveryLog> findByDeliveryAgentIdOrderByTimestampDesc(Long deliveryAgentId);
}