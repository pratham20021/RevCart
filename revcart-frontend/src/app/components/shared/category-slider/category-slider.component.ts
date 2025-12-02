import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-slider.component.html',
  styleUrls: ['./category-slider.component.css']
})
export class CategorySliderComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
    
    // Subscribe to category updates for real-time updates
    this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
      this.isLoading = false;
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback to hardcoded categories if service fails
        this.categories = [
          { id: 1, name: 'fruits', description: 'Fruits & Vegetables' },
          { id: 2, name: 'dairy', description: 'Dairy & Eggs' },
          { id: 3, name: 'meat', description: 'Meat & Seafood' },
          { id: 4, name: 'beverages', description: 'Beverages' },
          { id: 5, name: 'bakery', description: 'Bakery' },
          { id: 6, name: 'snacks', description: 'Snacks' },
          { id: 7, name: 'frozen', description: 'Frozen Foods' }
        ];
        this.isLoading = false;
      }
    });
  }

  getCategoryDisplayName(category: Category): string {
    return category.description || this.formatCategoryName(category.name);
  }

  private formatCategoryName(name: string): string {
    const categoryMap: { [key: string]: string } = {
      'fruits': 'Fruits & Vegetables',
      'vegetables': 'Vegetables',
      'dairy': 'Dairy & Eggs',
      'meat': 'Meat & Seafood',
      'beverages': 'Beverages',
      'bakery': 'Bakery',
      'snacks': 'Snacks',
      'frozen': 'Frozen Foods'
    };
    return categoryMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
  }

  onCategoryClick(category: Category) {
    // Navigate to products page with category filter
    // This will be handled by the router link in template
  }

  trackByCategory(index: number, category: Category): number | string {
    return category.id || category.name;
  }
}