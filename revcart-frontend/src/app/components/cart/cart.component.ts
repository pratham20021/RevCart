import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  deliveryFee = 30;
  discount = 0;
  couponCode = '';
  couponMessage = '';
  couponApplied = false;
  
  private cartSubscription: Subscription = new Subscription();
  
  // Available coupons
  availableCoupons = [
    { code: 'SAVE10', discount: 10, minAmount: 200 },
    { code: 'FRESH20', discount: 20, minAmount: 500 },
    { code: 'WELCOME15', discount: 15, minAmount: 300 }
  ];
  
  constructor(private cartService: CartService) {}
  
  ngOnInit() {
    this.cartSubscription = this.cartService.getCartItems().subscribe(
      items => {
        this.cartItems = items;
        // Recalculate discount if coupon was applied
        if (this.couponApplied) {
          this.applyCoupon(this.couponCode);
        }
      }
    );
  }
  
  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
  
  increaseQuantity(item: CartItem) {
    const result = this.cartService.increaseQuantity(item.id);
    if (!result.success && result.message) {
      alert(result.message);
    }
  }
  
  decreaseQuantity(item: CartItem) {
    this.cartService.decreaseQuantity(item.id);
  }
  
  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);
  }
  
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  getGST(): number {
    return Math.round(this.getSubtotal() * 0.18); // 18% GST
  }
  
  getDeliveryFee(): number {
    return this.getSubtotal() > 199 ? 0 : this.deliveryFee;
  }
  
  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee() + this.getGST() - this.discount;
  }
  
  applyCoupon(code: string) {
    if (!code.trim()) {
      this.couponMessage = 'Please enter a coupon code';
      this.couponApplied = false;
      this.discount = 0;
      return;
    }
    
    const coupon = this.availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      this.couponMessage = 'Invalid coupon code';
      this.couponApplied = false;
      this.discount = 0;
      return;
    }
    
    const subtotal = this.getSubtotal();
    
    if (subtotal < coupon.minAmount) {
      this.couponMessage = `Minimum order amount ₹${coupon.minAmount} required for this coupon`;
      this.couponApplied = false;
      this.discount = 0;
      return;
    }
    
    this.discount = Math.round(subtotal * (coupon.discount / 100));
    this.couponMessage = `Coupon applied! You saved ₹${this.discount}`;
    this.couponApplied = true;
    this.couponCode = code;
  }
  
  trackByItemId(index: number, item: CartItem): number {
    return item.id;
  }
}