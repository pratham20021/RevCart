package com.revcart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.revcart.repository",
                      excludeFilters = @org.springframework.context.annotation.ComponentScan.Filter(
                          type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
                          classes = {
                              com.revcart.repository.DeliveryLogRepository.class,
                              com.revcart.repository.NotificationRepository.class
                          }
                      ))
public class JpaConfig {
}