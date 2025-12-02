import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private mockCategories: Category[] = [
    { id: 1, name: 'fruits', description: 'Fruits & Vegetables' },
    { id: 2, name: 'dairy', description: 'Dairy & Eggs' },
    { id: 3, name: 'meat', description: 'Meat & Seafood' },
    { id: 4, name: 'beverages', description: 'Beverages' },
    { id: 5, name: 'bakery', description: 'Bakery' },
    { id: 6, name: 'snacks', description: 'Snacks' }
  ];

  constructor(private http: HttpClient) {
    this.categoriesSubject.next(this.mockCategories);
  }

  getAllCategories(): Observable<Category[]> {
    return of(this.mockCategories);
  }

  createCategory(category: Category): Observable<Category> {
    const newCategory = {
      ...category,
      id: Math.max(...this.mockCategories.map(c => c.id || 0)) + 1
    };
    this.mockCategories.push(newCategory);
    this.categoriesSubject.next([...this.mockCategories]);
    return of(newCategory);
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }
}