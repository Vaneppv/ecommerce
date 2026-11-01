import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS } from './data/products.mock';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = TestBed.inject(ProductService);
  });

  it('devuelve la primera página con el límite pedido', async () => {
    const page = await firstValueFrom(service.getPage(0, 20));
    expect(page.products.length).toBe(20);
    expect(page.total).toBe(PRODUCTS.length);
    expect(page.products[0].id).toBe(1);
  });

  it('respeta skip y devuelve menos productos al final', async () => {
    const page = await firstValueFrom(service.getPage(PRODUCTS.length - 5, 20));
    expect(page.products.length).toBe(5);
    expect(page.skip).toBe(PRODUCTS.length - 5);
  });

  it('los productos tienen ids únicos', () => {
    const ids = new Set(PRODUCTS.map((p) => p.id));
    expect(ids.size).toBe(PRODUCTS.length);
  });
});
