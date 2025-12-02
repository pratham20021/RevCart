import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductFiltersComponent, FilterOptions } from '../../product-filters/product-filters.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, ProductFiltersComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = 'all';
  currentCategory: string | null = null;
  currentFilters: FilterOptions = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Subscribe to query parameters to handle category filtering
    this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'];
      console.log('Route category parameter:', this.currentCategory);
      
      if (this.currentCategory) {
        this.selectedCategory = this.currentCategory.toLowerCase();
        this.loadProductsByCategory(this.currentCategory);
      } else {
        this.selectedCategory = 'all';
        this.loadAllProducts();
      }
    });
  }
  
  loadAllProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadProductsByCategory(category: string) {
    this.loading = true;
    console.log('Loading products for category:', category);
    
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        console.log('Products received:', products.length);
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error loading products by category:', error);
        // Fallback to all products if category filtering fails
        this.loadAllProducts();
      }
    });
  }
  
  filterProducts() {
    this.applyAdvancedFilters();
  }
  
  onFiltersChanged(filters: FilterOptions) {
    this.currentFilters = filters;
    this.applyAdvancedFilters();
  }
  
  applyAdvancedFilters() {
    let filtered = [...this.products];
    
    // Apply search filter first
    if (this.searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter from buttons
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
    
    // Apply advanced filters
    if (this.currentFilters) {
      // Category filter from sidebar
      if (this.currentFilters.category && this.currentFilters.category !== '') {
        filtered = filtered.filter(product => product.category === this.currentFilters.category);
      }
      
      // Price range filter
      if (this.currentFilters.minPrice !== undefined) {
        filtered = filtered.filter(product => product.price >= this.currentFilters.minPrice!);
      }
      if (this.currentFilters.maxPrice !== undefined) {
        filtered = filtered.filter(product => product.price <= this.currentFilters.maxPrice!);
      }
      
      // Brand filter
      if (this.currentFilters.brand && this.currentFilters.brand !== '') {
        filtered = filtered.filter(product => {
          const productBrand = (product as any).brand;
          return productBrand && productBrand === this.currentFilters.brand;
        });
      }
      
      // Apply sorting
      if (this.currentFilters.sortBy && this.currentFilters.sortOrder) {
        this.sortFilteredProducts(filtered, this.currentFilters.sortBy, this.currentFilters.sortOrder);
      }
    }
    
    this.filteredProducts = filtered;
  }
  
  sortFilteredProducts(products: Product[], sortBy: string, sortOrder: string) {
    products.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  filterByCategory(category: string) {
    console.log('Filter by category clicked:', category);
    this.selectedCategory = category.toLowerCase();
    
    if (category === 'all') {
      this.loadAllProducts();
    } else {
      this.loadProductsByCategory(category);
    }
  }
  
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}