import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';
import { CouponService, Coupon } from '../../services/coupon.service';



interface OrderData {
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  deliveryInstructions: string;
  paymentMethod: 'card' | 'upi' | 'cod';
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
  orderData: OrderData = {
    customerName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    deliveryInstructions: '',
    paymentMethod: 'card'
  };
  
  cartItems: CartItem[] = [];
  
  baseDeliveryFee = 30;
  isProcessing = false;
  showUpiModal = false;
  showInvoice = false;
  invoiceData: any = null;
  
  // Coupon related properties
  couponCode = '';
  appliedCoupon: Coupon | null = null;
  couponDiscount = 0;
  couponError = '';
  
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;
  
  constructor(
    private router: Router,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private couponService: CouponService
  ) {}
  
  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }
  
  selectPaymentMethod(method: 'card' | 'upi' | 'cod') {
    this.orderData.paymentMethod = method;
  }
  
  closeUpiModal() {
    this.showUpiModal = false;
  }
  
  completeUpiPayment() {
    this.showUpiModal = false;
    // Simulate UPI payment processing
    setTimeout(() => {
      this.generateInvoice();
    }, 500);
  }
  
  closeInvoice() {
    this.showInvoice = false;
    this.router.navigate(['/order-success']);
  }
  
  downloadInvoice() {
    window.print();
  }
  
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  getGST(): number {
    return Math.round(this.getSubtotal() * 0.18); // 18% GST
  }
  
  getDeliveryFee(): number {
    const baseFee = this.getSubtotal() > 199 ? 0 : this.baseDeliveryFee;
    // Apply free delivery coupon
    if (this.appliedCoupon?.type === 'FREE_DELIVERY') {
      return 0;
    }
    return baseFee;
  }
  
  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee() + this.getGST() - this.couponDiscount;
  }
  
  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  async onSubmit() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Create order data
      const orderPayload = {
        items: this.cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: this.getTotal(),
        customerName: this.orderData.customerName,
        email: this.orderData.email,
        phone: this.orderData.phone,
        address: this.orderData.address,
        paymentMethod: this.orderData.paymentMethod
      };

      if (this.orderData.paymentMethod === 'cod') {
        // Process COD payment
        await this.paymentService.processCOD(orderPayload).toPromise();
        this.generateInvoice();
      } else if (this.orderData.paymentMethod === 'upi') {
        // Show UPI modal for UPI payment
        this.showUpiModal = true;
      } else if (this.orderData.paymentMethod === 'card') {
        // Process card payment (simulate success for demo)
        setTimeout(() => {
          this.generateInvoice();
        }, 1000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }
  
  generateInvoice() {
    const orderId = this.generateOrderId();
    
    this.invoiceData = {
      orderId: orderId,
      customerName: this.orderData.customerName,
      email: this.orderData.email,
      phone: this.orderData.phone,
      address: this.orderData.address,
      paymentMethod: this.orderData.paymentMethod,
      items: this.cartItems,
      subtotal: this.getSubtotal(),
      deliveryFee: this.getDeliveryFee(),
      gst: this.getGST(),
      total: this.getTotal(),
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000)
    };
    
    // Save order to backend
    this.checkoutService.saveOrder(this.invoiceData).subscribe({
      next: (response) => {
        console.log('Order saved successfully:', response);
      },
      error: (error) => {
        console.error('Error saving order:', error);
      }
    });
    
    // Clear cart after successful order
    this.cartService.clearCart();
    
    // Store in session storage for success page
    sessionStorage.setItem('orderSummary', JSON.stringify(this.invoiceData));
    
    this.showInvoice = true;
  }
  
  applyCoupon() {
    if (!this.couponCode.trim()) {
      this.couponError = 'Please enter a coupon code';
      return;
    }
    
    this.couponService.validateCoupon(this.couponCode, this.getSubtotal(), this.baseDeliveryFee).subscribe({
      next: (response) => {
        this.appliedCoupon = response.coupon;
        this.couponDiscount = response.discount;
        this.couponError = '';
        alert(`Coupon applied! You saved ₹${this.couponDiscount}`);
      },
      error: (error) => {
        this.couponError = error.error || 'Invalid coupon code';
        this.appliedCoupon = null;
        this.couponDiscount = 0;
      }
    });
  }
  
  removeCoupon() {
    this.appliedCoupon = null;
    this.couponDiscount = 0;
    this.couponCode = '';
    this.couponError = '';
  }
  
  private generateOrderId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `RC${timestamp.slice(-6)}${random}`;
  }
}