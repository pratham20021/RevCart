package com.revcart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.revcart.repository", 
                        includeFilters = @org.springframework.context.annotation.ComponentScan.Filter(
                            type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
                            classes = {
                                com.revcart.repository.DeliveryLogRepository.class,
                                com.revcart.repository.NotificationRepository.class
                            }
                        ))
public class MongoConfig extends AbstractMongoClientConfiguration {
    
    @Override
    protected String getDatabaseName() {
        return "revcart_logs";
    }
}