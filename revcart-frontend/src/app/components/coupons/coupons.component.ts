import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponService, Coupon } from '../../services/coupon.service';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  loading = true;

  constructor(private couponService: CouponService) {}

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    this.couponService.getAllCoupons().subscribe({
      next: (coupons) => {
        this.coupons = coupons;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading coupons:', error);
        this.loading = false;
      }
    });
  }

  copyCouponCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      alert(`Coupon code "${code}" copied to clipboard!`);
    });
  }

  getCouponIcon(type: string): string {
    switch (type) {
      case 'FREE_DELIVERY': return 'fas fa-truck';
      case 'PERCENTAGE': return 'fas fa-percentage';
      case 'FIXED_AMOUNT': return 'fas fa-rupee-sign';
      default: return 'fas fa-tag';
    }
  }

  getCouponValue(coupon: Coupon): string {
    switch (coupon.type) {
      case 'FREE_DELIVERY': return 'Free Delivery';
      case 'PERCENTAGE': return `${coupon.value}% OFF`;
      case 'FIXED_AMOUNT': return `₹${coupon.value} OFF`;
      default: return 'Discount';
    }
  }
}