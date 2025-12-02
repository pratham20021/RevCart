package com.revcart.controller;

import com.revcart.entity.Product;
import com.revcart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage = productService.getAllProducts(pageable);
            return ResponseEntity.ok(productPage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProductsList() {
        try {
            List<Product> products = productService.getAllProductsList();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        try {
            // Decode URL-encoded category name
            String decodedCategory = java.net.URLDecoder.decode(category, "UTF-8");
            List<Product> products = productService.getProductsByCategory(decodedCategory);
            
            System.out.println("Category requested: " + decodedCategory);
            System.out.println("Products found: " + products.size());
            
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand) {
        try {
            List<Product> products = productService.filterProducts(category, minPrice, maxPrice, brand);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        try {
            List<String> brands = productService.getAllBrands();
            return ResponseEntity.ok(brands);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product name is required");
            }
            if (product.getPrice() == null) {
                return ResponseEntity.badRequest().body("Product price is required");
            }
            if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product category is required");
            }
            
            // Ensure all stock fields are set with defaults
            if (product.getInitialStock() == null) {
                product.setInitialStock(0);
            }
            if (product.getCurrentStock() == null) {
                product.setCurrentStock(product.getInitialStock());
            }
            if (product.getStock() == null) {
                product.setStock(product.getCurrentStock());
            }
            if (product.getRating() == null) {
                product.setRating(new BigDecimal("4.5"));
            }
            
            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating product: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return productService.getProductById(id)
                    .map(existingProduct -> {
                        product.setId(id);
                        Product updatedProduct = productService.saveProduct(product);
                        return ResponseEntity.ok(updatedProduct);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating product: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            System.out.println("DELETE request received for product ID: " + id);
            
            if (productService.getProductById(id).isPresent()) {
                productService.deleteProduct(id);
                System.out.println("Product deleted successfully: " + id);
                return ResponseEntity.ok().build(); // Return 200 OK with no body
            } else {
                System.out.println("Product not found: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product: " + e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable Long id) {
        try {
            return productService.getProductById(id)
                    .map(product -> {
                        // Toggle stock status by setting currentStock to 0 or restoring from initialStock
                        if (product.getCurrentStock() > 0) {
                            product.setCurrentStock(0);
                        } else {
                            product.setCurrentStock(product.getInitialStock());
                        }
                        Product updatedProduct = productService.saveProduct(product);
                        return ResponseEntity.ok(updatedProduct);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error toggling product status: " + e.getMessage());
        }
    }
}