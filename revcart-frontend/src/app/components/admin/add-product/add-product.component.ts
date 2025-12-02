import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, CreateProductRequest } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  categories: Category[] = [];
  showCategoryModal = false;
  newCategory = {
    name: '',
    description: ''
  };
  
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
    private categoryService: CategoryService,
    private router: Router
  ) {}
  
  ngOnInit() {
    console.log('AddProductComponent initialized');
    // Set default categories immediately
    this.categories = [
      { id: 1, name: 'Fruits & Vegetables', description: 'Fresh fruits and vegetables' },
      { id: 2, name: 'Dairy & Eggs', description: 'Milk, cheese, eggs and dairy products' },
      { id: 3, name: 'Meat & Seafood', description: 'Fresh meat and seafood' },
      { id: 4, name: 'Beverages', description: 'Drinks and beverages' },
      { id: 5, name: 'Snacks', description: 'Snacks and quick bites' },
      { id: 6, name: 'Bakery', description: 'Bread, cakes and bakery items' },
      { id: 7, name: 'Frozen Foods', description: 'Frozen and preserved foods' }
    ];
    // Then try to load from API
    this.loadCategories();
  }
  
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log('Categories received from API:', categories);
        if (categories && categories.length > 0) {
          this.categories = categories;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Keep the default categories already set
      }
    });
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
  
  toggleCategoryModal() {
    this.showCategoryModal = !this.showCategoryModal;
    if (!this.showCategoryModal) {
      this.newCategory = { name: '', description: '' };
    }
  }
  
  createCategory() {
    if (!this.newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    this.categoryService.createCategory(this.newCategory.name.trim(), this.newCategory.description).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.product.category = category.name;
        this.toggleCategoryModal();
        alert('Category created successfully!');
      },
      error: (error) => {
        console.error('Error creating category:', error);
        alert(error.error || 'Failed to create category. Please try again.');
      }
    });
  }
}