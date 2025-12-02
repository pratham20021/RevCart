import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: string;
  sortOrder?: string;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.css']
})
export class ProductFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterOptions>();

  categories: any[] = [];
  brands: string[] = [];
  
  filters: FilterOptions = {
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    brand: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: 'Over ₹5000', min: 5000, max: undefined }
  ];

  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)', sortBy: 'name', sortOrder: 'asc' },
    { value: 'name-desc', label: 'Name (Z-A)', sortBy: 'name', sortOrder: 'desc' },
    { value: 'price-asc', label: 'Price (Low to High)', sortBy: 'price', sortOrder: 'asc' },
    { value: 'price-desc', label: 'Price (High to Low)', sortBy: 'price', sortOrder: 'desc' },
    { value: 'rating-desc', label: 'Highest Rated', sortBy: 'rating', sortOrder: 'desc' }
  ];

  showFilters = false;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadBrands();
  }

  loadCategories() {
    this.categories = [
      { name: 'Fruits & Vegetables' },
      { name: 'Dairy & Eggs' },
      { name: 'Meat & Seafood' },
      { name: 'Beverages' },
      { name: 'Snacks' },
      { name: 'Bakery' },
      { name: 'Frozen Foods' }
    ];
  }

  loadBrands() {
    this.productService.getAllBrands().subscribe({
      next: (brands: string[]) => {
        this.brands = brands;
      },
      error: (error: any) => console.error('Error loading brands:', error)
    });
  }

  onFilterChange() {
    this.filtersChanged.emit(this.filters);
  }

  onSortChange(sortValue: string) {
    const sortOption = this.sortOptions.find(option => option.value === sortValue);
    if (sortOption) {
      this.filters.sortBy = sortOption.sortBy;
      this.filters.sortOrder = sortOption.sortOrder;
      this.onFilterChange();
    }
  }

  onPriceRangeSelect(range: any) {
    this.filters.minPrice = range.min;
    this.filters.maxPrice = range.max;
    this.onFilterChange();
  }

  clearFilters() {
    this.filters = {
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      brand: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.onFilterChange();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.category || 
             this.filters.minPrice !== undefined || 
             this.filters.maxPrice !== undefined || 
             this.filters.brand);
  }
}