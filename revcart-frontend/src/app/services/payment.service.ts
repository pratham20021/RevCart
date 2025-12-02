import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) { }

  createPaymentOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, orderData);
  }

  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, paymentData);
  }

  processCOD(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cod`, orderData);
  }

  initiateRazorpayPayment(orderData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.createPaymentOrder(orderData).subscribe({
        next: (paymentOrder) => {
          const options = {
            key: paymentOrder.key,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            name: 'RevCart',
            description: 'Order Payment',
            order_id: paymentOrder.id,
            handler: (response: any) => {
              this.verifyPayment({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                userId: orderData.userId
              }).subscribe({
                next: (result) => resolve(result),
                error: (error) => reject(error)
              });
            },
            prefill: {
              name: orderData.customerName,
              email: orderData.email,
              contact: orderData.phone
            },
            theme: {
              color: '#3399cc'
            }
          };

          const rzp = new Razorpay(options);
          rzp.open();
        },
        error: (error) => reject(error)
      });
    });
  }
}