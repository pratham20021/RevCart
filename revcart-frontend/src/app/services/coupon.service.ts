import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  type: 'FREE_DELIVERY' | 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrderAmount?: number;
  active: boolean;
  firstOrderOnly: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) {}

  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  validateCoupon(code: string, orderAmount: number, deliveryCharges: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, {
      code,
      orderAmount,
      deliveryCharges
    });
  }
}