package com.revcart.controller;

import com.revcart.entity.Coupon;
import com.revcart.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/coupons")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CouponController {
    
    @Autowired
    private CouponService couponService;
    
    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllActiveCoupons();
        return ResponseEntity.ok(coupons);
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            BigDecimal orderAmount = new BigDecimal(request.get("orderAmount").toString());
            BigDecimal deliveryCharges = new BigDecimal(request.get("deliveryCharges").toString());
            
            Optional<Coupon> couponOpt = couponService.validateCoupon(code);
            
            if (couponOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid coupon code");
            }
            
            Coupon coupon = couponOpt.get();
            BigDecimal discount = couponService.calculateDiscount(coupon, orderAmount, deliveryCharges);
            
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "coupon", coupon,
                "discount", discount,
                "message", "Coupon applied successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error validating coupon: " + e.getMessage());
        }
    }
}