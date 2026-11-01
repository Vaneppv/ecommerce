import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { PRODUCTS } from './data/products.mock';
import { ProductPage } from './models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly latencyMs = 500;

  getPage(skip = 0, limit = 20): Observable<ProductPage> {
    const page: ProductPage = {
      products: PRODUCTS.slice(skip, skip + limit),
      total: PRODUCTS.length,
      skip,
      limit,
    };
    return of(page).pipe(delay(this.latencyMs));
  }
}
