import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS } from './data/products.mock';
import { ProductPage } from './models/product-page.model';
import { Product } from './models/product.model';
import { ProductService } from './product-service';

const API_URL = 'https://dummyjson.com/products';

function pageOf(products: Product[], skip = 0, limit = 20): ProductPage {
  return { products, total: products.length, skip, limit };
}

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
    const response = firstValueFrom(service.getPage(0, 20));

    const req = httpMock.expectOne(`${API_URL}?skip=0&limit=20`);
    req.flush(pageOf(PRODUCTS.slice(0, 20), 0, 20));

    const page = await response;
    expect(page.products.length).toBe(20);
    expect(page.total).toBe(20);
    expect(page.products[0].id).toBe(1);
  });

  it('respeta skip y devuelve menos productos al final', async () => {
    const skip = PRODUCTS.length - 5;
    const response = firstValueFrom(service.getPage(skip, 20));

    const req = httpMock.expectOne(`${API_URL}?skip=${skip}&limit=20`);
    req.flush(pageOf(PRODUCTS.slice(skip), skip, 20));

    const page = await response;
    expect(page.products.length).toBe(5);
    expect(page.skip).toBe(skip);
  });

  it('usa el endpoint de categoría y devuelve sus productos', async () => {
    const category = 'ropa';
    const products = PRODUCTS.filter((p) => p.category.toLowerCase() === category);
    const response = firstValueFrom(service.getPage(0, 20, category));

    const req = httpMock.expectOne(`${API_URL}/category/${category}?skip=0&limit=20`);
    req.flush(pageOf(products, 0, 20));

    const page = await response;
    expect(page.products.every((p) => p.category.toLowerCase() === category)).toBe(true);
    expect(page.total).toBe(products.length);
  });

  it('usa el endpoint de búsqueda y devuelve los resultados', async () => {
    const search = 'auriculares';
    const products = PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
    );
    const response = firstValueFrom(service.getPage(0, 20, '', search));

    const req = httpMock.expectOne(`${API_URL}/search?q=${search}&skip=0&limit=20`);
    req.flush(pageOf(products, 0, 20));

    const page = await response;
    expect(page.products.length).toBeGreaterThan(0);
    expect(page.products[0].title.toLowerCase()).toContain(search);
  });

  it('devuelve productos mock cuando falla la API', async () => {
    const response = firstValueFrom(service.getPage(0, 20, 'ropa'));

    const req = httpMock.expectOne(`${API_URL}/category/ropa?skip=0&limit=20`);
    req.flush('error', { status: 500, statusText: 'Server Error' });

    const page = await response;
    expect(page.products.every((p) => p.category.toLowerCase() === 'ropa')).toBe(true);
    expect(page.total).toBe(PRODUCTS.filter((p) => p.category.toLowerCase() === 'ropa').length);
  });

  it('obtiene los productos populares ordenados por rating', async () => {
    const response = firstValueFrom(service.getPopular(6));

    const req = httpMock.expectOne(`${API_URL}?limit=6&sortBy=rating&order=desc`);
    req.flush(
      pageOf([...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 6), 0, 6),
    );

    const products = await response;
    expect(products.length).toBe(6);
    expect(products[0].rating).toBeGreaterThanOrEqual(products[1].rating);
  });

  it('obtiene un producto por su id', async () => {
    const response = firstValueFrom(service.getProductById(1));

    const req = httpMock.expectOne(`${API_URL}/1`);
    req.flush(PRODUCTS[0]);

    const product = await response;
    expect(product?.id).toBe(1);
  });

  it('devuelve null al buscar un id inexistente', async () => {
    const response = firstValueFrom(service.getProductById(999999));

    const req = httpMock.expectOne(`${API_URL}/999999`);
    req.flush('not found', { status: 404, statusText: 'Not Found' });

    const product = await response;
    expect(product).toBeNull();
  });

  it('obtiene la lista de categorías', async () => {
    const response = firstValueFrom(service.getCategories());

    const req = httpMock.expectOne(`${API_URL}/category-list`);
    req.flush(['beauty', 'smartphones']);

    const categories = await response;
    expect(categories).toEqual(['beauty', 'smartphones']);
  });

  it('usa categorías mock cuando falla la API', async () => {
    const response = firstValueFrom(service.getCategories());

    const req = httpMock.expectOne(`${API_URL}/category-list`);
    req.flush('error', { status: 500, statusText: 'Server Error' });

    const categories = await response;
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('electrónica');
  });

  it('los productos tienen ids únicos', () => {
    const ids = new Set(PRODUCTS.map((p) => p.id));
    expect(ids.size).toBe(PRODUCTS.length);
  });
});
