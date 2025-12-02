import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { NotificationsComponent } from './components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'RevCart - Premium Grocery Delivery';
  cartCount = 0;
  
  private cartSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();
  
  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}
  
  ngOnInit() {
    this.cartSubscription = this.cartService.getCartItems().subscribe(
      items => {
        this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      }
    );
    
    this.authSubscription = this.authService.currentUser$.subscribe(
      user => {
        // This will trigger change detection when user state changes
      }
    );
  }
  
  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
  
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
  
  logout() {
    this.authService.logout();
  }
}