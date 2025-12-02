import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="orders-container"><h2>My Orders</h2></div>`,
  styles: [`
    .orders-container { padding: 20px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 15px; margin: 20px; }
  `]
})
export class OrderListComponent {}