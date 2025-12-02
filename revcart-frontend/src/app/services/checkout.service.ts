import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProductService } from './product.service';
import { CartItem } from './cart.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) {}

  processOrder(cartItems: CartItem[]): Observable<{ success: boolean; message?: string }> {
    // Validate stock for all items
    for (const item of cartItems) {
      if (item.quantity > item.currentStock) {
        return of({
          success: false,
          message: `Insufficient stock for ${item.name}. Only ${item.currentStock} available.`
        });
      }
    }

    // Reduce stock for each item
    cartItems.forEach(item => {
      this.productService.reduceStock(item.id, item.quantity).subscribe();
    });

    return of({ success: true });
  }
  
  saveOrder(orderData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/orders`, orderData);
  }
  
  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/orders/user`);
  }
  
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/orders/admin`);
  }
}