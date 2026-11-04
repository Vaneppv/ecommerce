import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS } from './data/products.mock';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devuelve la primera página con el límite pedido', async () => {
    const promise = firstValueFrom(service.getPage(0, 20));
    const request = httpMock.expectOne(
      (req) => req.url.startsWith('https://dummyjson.com/products?') && req.url.includes('skip=0'),
    );
    request.flush({
      products: PRODUCTS.slice(0, 20),
      total: PRODUCTS.length,
      skip: 0,
      limit: 20,
    });

    const page = await promise;
    expect(page.products.length).toBe(20);
    expect(page.total).toBe(PRODUCTS.length);
    expect(page.products[0].id).toBe(1);
  });

  it('respeta skip y devuelve menos productos al final', async () => {
    const skip = PRODUCTS.length - 5;
    const promise = firstValueFrom(service.getPage(skip, 20));
    const request = httpMock.expectOne(
      (req) =>
        req.url.startsWith('https://dummyjson.com/products?') && req.url.includes(`skip=${skip}`),
    );
    request.flush({
      products: PRODUCTS.slice(skip),
      total: PRODUCTS.length,
      skip,
      limit: 20,
    });

    const page = await promise;
    expect(page.products.length).toBe(5);
    expect(page.skip).toBe(skip);
  });

  it('usa los datos locales cuando la API falla', async () => {
    const promise = firstValueFrom(service.getPage(0, 5));
    const request = httpMock.expectOne((req) =>
      req.url.startsWith('https://dummyjson.com/products'),
    );
    request.flush(null, { status: 500, statusText: 'Server Error' });

    const page = await promise;
    expect(page.products.length).toBe(5);
    expect(page.total).toBe(PRODUCTS.length);
  });

  it('los productos tienen ids únicos', () => {
    const ids = new Set(PRODUCTS.map((p) => p.id));
    expect(ids.size).toBe(PRODUCTS.length);
  });
});
