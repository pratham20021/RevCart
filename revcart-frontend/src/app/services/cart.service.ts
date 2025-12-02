import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category?: string;
  currentStock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  constructor() {
    this.loadCartFromStorage();
  }
  
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }
  
  getQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
  
  addToCart(product: any): { success: boolean; message?: string } {
    const existingItemIndex = this.cartItems.findIndex(item => item.id === product.id);
    const currentQuantity = existingItemIndex >= 0 ? this.cartItems[existingItemIndex].quantity : 0;
    const newQuantity = currentQuantity + 1;
    
    if (newQuantity > product.currentStock) {
      return { 
        success: false, 
        message: `Only ${product.currentStock} items available` 
      };
    }
    
    if (existingItemIndex >= 0) {
      // Product exists, increase quantity
      this.cartItems = this.cartItems.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: newQuantity }
          : item
      );
    } else {
      // Product doesn't exist, add new item
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        category: product.category,
        currentStock: product.currentStock
      };
      this.cartItems = [...this.cartItems, newItem];
    }
    
    this.updateCart();
    return { success: true };
  }
  
  increaseQuantity(productId: number): { success: boolean; message?: string } {
    const item = this.cartItems.find(i => i.id === productId);
    if (item && item.quantity + 1 > item.currentStock) {
      return { 
        success: false, 
        message: `Only ${item.currentStock} items available` 
      };
    }
    
    this.cartItems = this.cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    this.updateCart();
    return { success: true };
  }
  
  decreaseQuantity(productId: number): void {
    this.cartItems = this.cartItems
      .map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter(item => item.quantity > 0); // Auto-remove when quantity reaches 0
    
    this.updateCart();
  }
  
  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.updateCart();
  }
  
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }
  
  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }
  
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
  
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.cartItems]);
      } catch (error) {
        console.error('Error parsing saved cart data:', error);
        localStorage.removeItem('cart');
        this.cartItems = [];
        this.cartSubject.next([]);
      }
    }
  }
}