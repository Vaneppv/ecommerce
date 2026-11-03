import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, ProductPage } from './models/product.model';
import { PRODUCTS } from './data/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com/products';
  private readonly latencyMs = 300;

  constructor(private http: HttpClient) {}

  getPage(
    skip = 0,
    limit = 20,
    category = '',
    search = ''
  ): Observable<ProductPage> {
    const trimmedCategory = category.trim().toLowerCase();
    const trimmedSearch = search.trim().toLowerCase();

    let url = `${this.apiUrl}?skip=${skip}&limit=${limit}`;

    if (trimmedSearch) {
      url = `${this.apiUrl}/search?q=${encodeURIComponent(trimmedSearch)}&skip=${skip}&limit=${limit}`;
    } else if (trimmedCategory && trimmedCategory !== 'todas') {
      url = `${this.apiUrl}/category/${encodeURIComponent(trimmedCategory)}?skip=${skip}&limit=${limit}`;
    }

    return this.http.get<ProductPage>(url).pipe(
      delay(this.latencyMs),
      catchError(() =>
        of(this.getFallbackPage(skip, limit, trimmedCategory, trimmedSearch))
      )
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      delay(this.latencyMs),
      catchError(() => of(this.getFallbackProductById(id)))
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/category-list`).pipe(
      delay(this.latencyMs),
      catchError(() => of(this.getFallbackCategories()))
    );
  }

  private getFallbackPage(
    skip: number,
    limit: number,
    category = '',
    search = ''
  ): ProductPage {
    const safeSkip = Math.max(0, skip);
    const safeLimit = Math.max(0, limit);

    let list = PRODUCTS;

    if (category && category !== 'todas') {
      list = list.filter((p) => p.category.toLowerCase() === category);
    }

    if (search) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    return {
      products: list.slice(safeSkip, safeSkip + safeLimit),
      total: list.length,
      skip: safeSkip,
      limit: safeLimit,
    };
  }

  private getFallbackProductById(id: number): Product | null {
    return PRODUCTS.find((p) => p.id === id) ?? null;
  }

  private getFallbackCategories(): string[] {
    const categories = new Set(PRODUCTS.map((p) => p.category));
    return Array.from(categories);
  }
}
