import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { PRODUCTS } from './data/products.mock';
import { ProductPage } from './models/product';

/**
 * Origen de datos de productos. Por ahora usa datos locales simulados y una
 * latencia artificial para poder ver los estados de carga. La firma de
 * getPage() es la misma que tendría con una API real (Observable<ProductPage>).
 */
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
