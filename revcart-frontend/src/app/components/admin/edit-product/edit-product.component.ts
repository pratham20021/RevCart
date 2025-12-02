import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product, CreateProductRequest } from '../../../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  categories: string[] = [];
  productId: number = 0;
  loading: boolean = true;
  
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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories = this.productService.getCategories();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.product = {
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.originalPrice || 0,
          initialStock: product.initialStock,
          currentStock: product.currentStock,
          stock: product.currentStock,
          imageUrl: product.imageUrl,
          category: product.category,
          rating: product.rating,
          active: product.inStock
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alert('Product not found');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit(): void {
    this.product.stock = this.product.currentStock;
    
    this.productService.updateProduct(this.productId, this.product).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}