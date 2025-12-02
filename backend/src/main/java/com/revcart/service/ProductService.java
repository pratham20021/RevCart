package com.revcart.service;

import com.revcart.entity.Product;
import com.revcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        try {
            return productRepository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }
    
    public List<Product> getAllProductsList() {
        try {
            return productRepository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }
    
    public Page<Product> getAllProducts(Pageable pageable) {
        try {
            return productRepository.findAll(pageable);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }
    
    public Optional<Product> getProductById(Long id) {
        try {
            return productRepository.findById(id);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
    
    public List<Product> getProductsByCategory(String category) {
        try {
            // Category mapping for common variations
            String normalizedCategory = normalizeCategoryName(category);
            
            // Try exact match first
            List<Product> products = productRepository.findByCategory(normalizedCategory);
            
            // If no exact match, try case-insensitive match
            if (products.isEmpty()) {
                products = productRepository.findByCategoryIgnoreCase(normalizedCategory);
            }
            
            // If still no match, try original category
            if (products.isEmpty()) {
                products = productRepository.findByCategoryIgnoreCase(category);
            }
            
            return products;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products by category: " + e.getMessage());
        }
    }
    
    private String normalizeCategoryName(String category) {
        // Map frontend category names to database category names
        switch (category.toLowerCase()) {
            case "fruits":
                return "Fruits & Vegetables";
            case "dairy":
                return "Dairy & Eggs";
            case "meat":
                return "Meat & Seafood";
            case "beverages":
                return "Beverages";
            case "snacks":
                return "Snacks";
            case "bakery":
                return "Bakery";
            case "frozen":
                return "Frozen Foods";
            default:
                return category;
        }
    }
    
    public List<Product> searchProducts(String query) {
        try {
            return productRepository.findByNameContainingIgnoreCase(query);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to search products: " + e.getMessage());
        }
    }
    
    @Transactional
    public Product saveProduct(Product product) {
        try {
            // Set defaults and synchronize fields
            if (product.getCreatedAt() == null) {
                product.setCreatedAt(LocalDateTime.now());
            }
            
            // Ensure all stock fields are properly set
            if (product.getInitialStock() == null) {
                product.setInitialStock(0);
            }
            if (product.getCurrentStock() == null) {
                product.setCurrentStock(product.getInitialStock());
            }
            if (product.getStock() == null) {
                product.setStock(product.getCurrentStock());
            }
            
            // Synchronize stock fields
            if (product.getCurrentStock() != null && !product.getCurrentStock().equals(product.getStock())) {
                product.setStock(product.getCurrentStock());
            }
            
            if (product.getRating() == null) {
                product.setRating(new BigDecimal("4.5"));
            }
            
            Product savedProduct = productRepository.save(product);
            productRepository.flush(); // Force immediate write to DB
            return savedProduct;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save product: " + e.getMessage());
        }
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        try {
            System.out.println("Service: Attempting to delete product with ID: " + id);
            
            if (!productRepository.existsById(id)) {
                throw new RuntimeException("Product not found with id: " + id);
            }
            
            // Check for foreign key constraints by catching the exception
            productRepository.deleteById(id);
            productRepository.flush(); // Force immediate delete from DB
            
            System.out.println("Service: Product deleted successfully: " + id);
            
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            System.err.println("Foreign key constraint violation: " + e.getMessage());
            throw new RuntimeException("Cannot delete product: it is referenced by other records (cart items, orders, etc.)");
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }
    
    @Transactional
    public boolean reduceStock(Long productId, Integer quantity) {
        try {
            Product product = productRepository.findById(productId).orElse(null);
            if (product == null || product.getCurrentStock() < quantity) {
                return false;
            }
            product.setCurrentStock(product.getCurrentStock() - quantity);
            product.setStock(product.getCurrentStock());
            productRepository.save(product);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @Transactional
    public void updateStock(Long productId, Integer initialStock, Integer currentStock) {
        try {
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                product.setInitialStock(initialStock);
                product.setCurrentStock(currentStock);
                product.setStock(currentStock);
                productRepository.save(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update stock: " + e.getMessage());
        }
    }
    
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        try {
            return productRepository.findByPriceRange(minPrice, maxPrice);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products by price range: " + e.getMessage());
        }
    }
    
    public List<Product> getProductsByBrand(String brand) {
        try {
            return productRepository.findByBrandIgnoreCase(brand);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch products by brand: " + e.getMessage());
        }
    }
    
    public List<String> getAllBrands() {
        try {
            return productRepository.findDistinctBrands();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch brands: " + e.getMessage());
        }
    }
    
    public List<Product> filterProducts(String category, BigDecimal minPrice, BigDecimal maxPrice, String brand) {
        try {
            List<Product> products = productRepository.findAll();
            
            return products.stream()
                .filter(p -> category == null || category.isEmpty() || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> minPrice == null || p.getPrice().compareTo(minPrice) >= 0)
                .filter(p -> maxPrice == null || p.getPrice().compareTo(maxPrice) <= 0)
                .filter(p -> brand == null || brand.isEmpty() || (p.getBrand() != null && p.getBrand().equalsIgnoreCase(brand)))
                .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to filter products: " + e.getMessage());
        }
    }
}