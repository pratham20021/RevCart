import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="product-detail"><h2>Product Detail</h2></div>`,
  styles: [`
    .product-detail { padding: 20px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 15px; margin: 20px; }
  `]
})
export class ProductDetailComponent {}