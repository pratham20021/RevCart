package com.revcart.repository;

import com.revcart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryAndNameContainingIgnoreCase(String category, String name);
    
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();
    
    @Query("SELECT p FROM Product p WHERE p.currentStock > 0")
    List<Product> findInStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.currentStock <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    List<Product> findByBrandIgnoreCase(String brand);
    
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByCategoryAndPriceRange(@Param("category") String category, @Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL")
    List<String> findDistinctBrands();
}