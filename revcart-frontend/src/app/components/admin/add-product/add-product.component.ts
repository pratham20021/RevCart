import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, CreateProductRequest } from '../../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  categories: string[] = [];
  
  product: CreateProductRequest = {
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    initialStock: 0,
    currentStock: 0,
    stock: 0,
    imageUrl: '',
    category: '',
    rating: 4.5,
    active: true
  };

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.categories = this.productService.getCategories();
  }

  onSubmit(): void {
    this.product.currentStock = this.product.initialStock;
    this.product.stock = this.product.initialStock;
    
    this.productService.createProduct(this.product).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Failed to create product. Please try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}