import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductPage } from './models/product.model';
import { PRODUCTS } from './data/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com/products';
  private readonly latencyMs = 500;

  constructor(private http: HttpClient) {}

  getPage(skip = 0, limit = 20): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.apiUrl}?skip=${skip}&limit=${limit}`).pipe(
      delay(this.latencyMs),
      // In case of error, return the mock data (no internet, etc)
      catchError(() => of(this.getFallbackPage(skip, limit))),
    );
  }

  private getFallbackPage(skip: number, limit: number): ProductPage {
    const safeSkip = Math.max(0, skip);
    const safeLimit = Math.max(0, limit);

    return {
      products: PRODUCTS.slice(safeSkip, safeSkip + safeLimit),
      total: PRODUCTS.length,
      skip: safeSkip,
      limit: safeLimit,
    };
  }
}
