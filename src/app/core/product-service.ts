import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from './models/product';
import { ProductPage } from './models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com/api/products';
  private readonly latencyMs = 500;

  constructor(private http: HttpClient) {}

  getPage(skip = 0, limit = 20): Observable<ProductPage> {
    return this.http
      .get<ProductPage>(`${this.apiUrl}?skip=${skip}&limit=${limit}`)
      .pipe(
        delay(this.latencyMs),
        map((page) => ({
          ...page,
          products: page.products.map((p) => ({
            ...p,
            dimensions: p.dimensions
              ? {
                  width: p.dimensions.width,
                  height: p.dimensions.height,
                  depth: p.dimensions.depth,
                }
              : { width: 0, height: 0, depth: 0 },
          })),
        })),
        catchError(() => of({ products: [], total: 0, skip, limit })),
      );
  }
}