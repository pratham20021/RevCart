import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'name';
  
  showDeleteModal: boolean = false;
  productToDelete: number | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.categories = this.productService.getCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.sortProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  filterProducts(): void {
    let filtered = [...this.products];
    
    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    
    this.filteredProducts = filtered;
    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.currentStock - a.currentStock;
        default:
          return 0;
      }
    });
  }

  addProduct(): void {
    this.router.navigate(['/admin/products/add']);
  }

  editProduct(productId: number): void {
    this.router.navigate(['/admin/products/edit', productId]);
  }

  deleteProduct(productId: number): void {
    this.productToDelete = productId;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.loadProducts();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  toggleStatus(productId: number): void {
    this.productService.toggleProductStatus(productId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error toggling product status:', error);
      }
    });
  }
}