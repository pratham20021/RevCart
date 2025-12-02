import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';



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
  
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;
  
  constructor(
    private router: Router,
    private cartService: CartService,
    private checkoutService: CheckoutService
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
    this.generateInvoice();
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
    return this.getSubtotal() > 199 ? 0 : this.baseDeliveryFee;
  }
  
  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee() + this.getGST();
  }
  
  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  onSubmit() {
    if (this.isProcessing) return;
    
    if (this.orderData.paymentMethod === 'upi') {
      this.showUpiModal = true;
      return;
    }
    
    this.isProcessing = true;
    
    // Process order with stock validation
    this.checkoutService.processOrder(this.cartItems).subscribe(result => {
      if (!result.success) {
        alert(result.message);
        this.isProcessing = false;
        return;
      }
      
      // Simulate order processing
      setTimeout(() => {
        this.generateInvoice();
        this.isProcessing = false;
      }, 2000);
    });
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
  
  private generateOrderId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `RC${timestamp.slice(-6)}${random}`;
  }
}