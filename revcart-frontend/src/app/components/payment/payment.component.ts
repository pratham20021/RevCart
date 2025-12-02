import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment',
  template: `
    <div class="payment-container">
      <h2>Choose Payment Method</h2>
      
      <div class="payment-methods">
        <div class="payment-option" (click)="selectPaymentMethod('card')">
          <input type="radio" name="payment" value="card" [(ngModel)]="selectedPaymentMethod">
          <label>Credit/Debit Card</label>
        </div>

        <div class="payment-option" (click)="selectPaymentMethod('upi')">
          <input type="radio" name="payment" value="upi" [(ngModel)]="selectedPaymentMethod">
          <label>UPI</label>
        </div>

        <div class="payment-option" (click)="selectPaymentMethod('cod')">
          <input type="radio" name="payment" value="cod" [(ngModel)]="selectedPaymentMethod">
          <label>Cash on Delivery</label>
        </div>
      </div>

      <div class="order-summary">
        <h3>Total: ₹{{orderData.total}}</h3>
      </div>

      <button class="pay-button" 
              (click)="processPayment()" 
              [disabled]="!selectedPaymentMethod || processing">
        {{processing ? 'Processing...' : 'Pay ₹' + orderData.total}}
      </button>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  selectedPaymentMethod = '';
  processing = false;
  orderData = { total: 0, items: [] };

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderData.total = this.cartService.getTotalAmount();
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  async processPayment() {
    this.processing = true;
    try {
      if (this.selectedPaymentMethod === 'cod') {
        await this.paymentService.processCOD(this.orderData).toPromise();
      } else {
        await this.paymentService.initiateRazorpayPayment(this.orderData);
      }
      this.router.navigate(['/order-success']);
    } catch (error) {
      console.error('Payment failed:', error);
    }
    this.processing = false;
  }
}