package com.revcart.service;

import com.revcart.entity.Coupon;
import com.revcart.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CouponService {
    
    @Autowired
    private CouponRepository couponRepository;
    
    public List<Coupon> getAllActiveCoupons() {
        return couponRepository.findByActiveTrue();
    }
    
    public Optional<Coupon> validateCoupon(String code) {
        return couponRepository.findByCodeAndActiveTrue(code);
    }
    
    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount, BigDecimal deliveryCharges) {
        switch (coupon.getType()) {
            case FREE_DELIVERY:
                return deliveryCharges;
            case PERCENTAGE:
                return orderAmount.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100));
            case FIXED_AMOUNT:
                return coupon.getValue();
            default:
                return BigDecimal.ZERO;
        }
    }
    
    public void initializeCoupons() {
        if (couponRepository.count() == 0) {
            couponRepository.save(new Coupon("FREE", "Free Delivery", "Get free delivery on your order", 
                Coupon.CouponType.FREE_DELIVERY, BigDecimal.ZERO, false));
            
            couponRepository.save(new Coupon("FIRST", "First Order Discount", "₹100 off on your first order", 
                Coupon.CouponType.FIXED_AMOUNT, BigDecimal.valueOf(100), true));
            
            couponRepository.save(new Coupon("SAVE10", "10% Off", "Get 10% discount on your order", 
                Coupon.CouponType.PERCENTAGE, BigDecimal.valueOf(10), false));
            
            couponRepository.save(new Coupon("SAVE15", "15% Off", "Get 15% discount on your order", 
                Coupon.CouponType.PERCENTAGE, BigDecimal.valueOf(15), false));
        }
    }
}