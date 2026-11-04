import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductPage } from './models/product.model';
import { PRODUCTS } from './data/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com/products';
  private readonly latencyMs = 300;

  constructor(private http: HttpClient) {}

  getPage(skip = 0, limit = 20, category = '', search = ''): Observable<ProductPage> {
    const cat = category.trim().toLowerCase();
    const term = search.trim().toLowerCase();
    const hasCategory = cat !== '' && cat !== 'todas';

    let request$: Observable<ProductPage>;

    if (term && hasCategory) {
      request$ = this.http
        .get<ProductPage>(`${this.apiUrl}/category/${encodeURIComponent(cat)}?limit=0`)
        .pipe(map((page) => this.paginate(page.products, term, skip, limit)));
    } else if (term) {
      request$ = this.http.get<ProductPage>(
        `${this.apiUrl}/search?q=${encodeURIComponent(term)}&skip=${skip}&limit=${limit}`,
      );
    } else if (hasCategory) {
      request$ = this.http.get<ProductPage>(
        `${this.apiUrl}/category/${encodeURIComponent(cat)}?skip=${skip}&limit=${limit}`,
      );
    } else {
      request$ = this.http.get<ProductPage>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
    }

    return request$.pipe(
      delay(this.latencyMs),
      catchError(() => of(this.getFallbackPage(skip, limit, cat, term))),
    );
  }

  getPopular(limit = 6): Observable<Product[]> {
    return this.http
      .get<ProductPage>(`${this.apiUrl}?limit=${limit}&sortBy=rating&order=desc`)
      .pipe(
        delay(this.latencyMs),
        map((page) => page.products),
        catchError(() => of(this.getFallbackPopular(limit))),
      );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      delay(this.latencyMs),
      catchError(() => of(this.getFallbackProductById(id))),
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/category-list`).pipe(
      delay(this.latencyMs),
      catchError(() => of(this.getFallbackCategories())),
    );
  }

  private paginate(products: Product[], term: string, skip: number, limit: number): ProductPage {
    const filtered = products.filter(
      (p) => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
    );

    return {
      products: filtered.slice(skip, skip + limit),
      total: filtered.length,
      skip,
      limit,
    };
  }

  private getFallbackPage(skip: number, limit: number, category = '', search = ''): ProductPage {
    const safeSkip = Math.max(0, skip);
    const safeLimit = Math.max(0, limit);

    let list = PRODUCTS;

    if (category && category !== 'todas') {
      list = list.filter((p) => p.category.toLowerCase() === category);
    }

    if (search) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
      );
    }

    return {
      products: list.slice(safeSkip, safeSkip + safeLimit),
      total: list.length,
      skip: safeSkip,
      limit: safeLimit,
    };
  }

  private getFallbackPopular(limit: number): Product[] {
    return [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, Math.max(0, limit));
  }

  private getFallbackProductById(id: number): Product | null {
    return PRODUCTS.find((p) => p.id === id) ?? null;
  }

  private getFallbackCategories(): string[] {
    return Array.from(new Set(PRODUCTS.map((p) => p.category)));
  }
}
