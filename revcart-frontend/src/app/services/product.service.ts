import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  initialStock: number;
  currentStock: number;
  quantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;



  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  getProducts(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}&sortBy=id&sortDir=desc`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    // Normalize category name and encode for URL
    const normalizedCategory = this.normalizeCategoryName(category);
    const encodedCategory = encodeURIComponent(normalizedCategory);
    console.log('Requesting category:', category, '-> normalized:', normalizedCategory);
    return this.http.get<Product[]>(`${this.apiUrl}/category/${encodedCategory}`);
  }
  
  private normalizeCategoryName(category: string): string {
    // Map display names to database values
    const categoryMap: { [key: string]: string } = {
      'fruits & vegetables': 'Fruits & Vegetables',
      'fruits': 'Fruits & Vegetables',
      'dairy & eggs': 'Dairy & Eggs', 
      'dairy': 'Dairy & Eggs',
      'meat & seafood': 'Meat & Seafood',
      'meat': 'Meat & Seafood',
      'beverages': 'Beverages',
      'snacks': 'Snacks',
      'bakery': 'Bakery',
      'frozen foods': 'Frozen Foods',
      'frozen': 'Frozen Foods'
    };
    
    const lowerCategory = category.toLowerCase();
    return categoryMap[lowerCategory] || category;
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
  }

  reduceStock(productId: number, quantity: number): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${productId}/reduce-stock`, { quantity });
  }

  updateProductStock(productId: number, initialStock: number, currentStock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}/stock`, { initialStock, currentStock });
  }
  
  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
  
  updateProduct(id: number, product: CreateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  
  deleteProduct(id: number): Observable<any> {
    console.log('Frontend: Deleting product with ID:', id);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Frontend: Delete API failed:', error);
        throw error;
      })
    );
  }

  toggleProductStatus(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/status`, {});
  }

  getCategories(): string[] {
    return ['fruits', 'vegetables', 'dairy', 'meat', 'beverages', 'bakery', 'snacks', 'frozen'];
  }

  // Category mapping for display names vs database values
  getCategoryMapping(): { [key: string]: string } {
    return {
      'fruits': 'fruits',
      'vegetables': 'vegetables', 
      'dairy': 'dairy',
      'meat': 'meat',
      'beverages': 'beverages',
      'bakery': 'bakery',
      'snacks': 'snacks',
      'frozen': 'frozen'
    };
  }

  getCategoryDisplayName(category: string): string {
    const displayNames: { [key: string]: string } = {
      'fruits': 'Fruits & Vegetables',
      'vegetables': 'Vegetables',
      'dairy': 'Dairy & Eggs', 
      'meat': 'Meat & Seafood',
      'beverages': 'Beverages',
      'bakery': 'Bakery',
      'snacks': 'Snacks',
      'frozen': 'Frozen Foods'
    };
    return displayNames[category.toLowerCase()] || category;
  }

  filterProducts(category?: string, minPrice?: number, maxPrice?: number, brand?: string): Observable<Product[]> {
    let params: string[] = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (minPrice !== undefined) params.push(`minPrice=${minPrice}`);
    if (maxPrice !== undefined) params.push(`maxPrice=${maxPrice}`);
    if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
    
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    return this.http.get<Product[]>(`${this.apiUrl}/filter${queryString}`);
  }

  getAllBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`);
  }
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  initialStock: number;
  currentStock: number;
  stock: number;
  imageUrl: string;
  category: string;
  brand?: string;
  rating?: number;
  active?: boolean;
}