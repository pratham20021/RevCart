import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="delivery-container"><h2>Delivery Dashboard</h2></div>`,
  styles: [`
    .delivery-container { padding: 20px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 15px; margin: 20px; }
  `]
})
export class DeliveryDashboardComponent {}