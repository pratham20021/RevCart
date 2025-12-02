import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface OrderSummary {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod';
  items: any[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  orderDate: Date;
  estimatedDelivery: Date;
}

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  
  orderSummary: OrderSummary | null = null;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.loadOrderSummary();
  }
  
  loadOrderSummary() {
    const orderData = sessionStorage.getItem('orderSummary');
    if (orderData) {
      this.orderSummary = JSON.parse(orderData);
      // Convert date strings back to Date objects
      if (this.orderSummary) {
        this.orderSummary.orderDate = new Date(this.orderSummary.orderDate);
        this.orderSummary.estimatedDelivery = new Date(this.orderSummary.estimatedDelivery);
      }
    } else {
      // If no order data found, redirect to home
      this.router.navigate(['/']);
    }
  }
  
  getFormattedDeliveryTime(): string {
    if (!this.orderSummary) return '';
    
    const deliveryTime = this.orderSummary.estimatedDelivery;
    const now = new Date();
    const diffMinutes = Math.ceil((deliveryTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) {
      return 'Arriving soon!';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }
  
  getPaymentMethodName(): string {
    if (!this.orderSummary) return '';
    
    switch (this.orderSummary.paymentMethod) {
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI Payment';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return 'Unknown';
    }
  }
  
  getPaymentIcon(): string {
    if (!this.orderSummary) return '';
    
    switch (this.orderSummary.paymentMethod) {
      case 'card':
        return 'fas fa-credit-card';
      case 'upi':
        return 'fas fa-mobile-alt';
      case 'cod':
        return 'fas fa-money-bill-wave';
      default:
        return 'fas fa-question';
    }
  }
  
  getPaymentClass(): string {
    if (!this.orderSummary) return '';
    
    switch (this.orderSummary.paymentMethod) {
      case 'card':
        return 'card-payment';
      case 'upi':
        return 'upi-payment';
      case 'cod':
        return 'cod-payment';
      default:
        return '';
    }
  }
  
  trackOrder() {
    // Implement order tracking functionality
    alert(`Tracking order ${this.orderSummary?.orderId}. This feature will be implemented soon!`);
  }
  
  ngOnDestroy() {
    // Clear order data when leaving the page
    // sessionStorage.removeItem('orderSummary');
  }
}