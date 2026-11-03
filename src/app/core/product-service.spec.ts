import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS } from './data/products.mock';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), ProductService],
    });
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

  it('filtra por categoría correctamente en el fallback', async () => {
    const page = await firstValueFrom(service.getPage(0, 20, 'ropa'));
    expect(page.products.every((p) => p.category.toLowerCase() === 'ropa')).toBe(true);
    expect(page.total).toBe(PRODUCTS.filter((p) => p.category.toLowerCase() === 'ropa').length);
  });

  it('filtra por término de búsqueda en el fallback', async () => {
    const page = await firstValueFrom(service.getPage(0, 20, '', 'auriculares'));
    expect(page.products.length).toBeGreaterThan(0);
    expect(page.products[0].title.toLowerCase()).toContain('auriculares');
  });

  it('obtiene un producto por su id', async () => {
    const product = await firstValueFrom(service.getProductById(1));
    expect(product).toBeTruthy();
    expect(product?.id).toBe(1);
  });

  it('devuelve null al buscar un id inexistente', async () => {
    const product = await firstValueFrom(service.getProductById(999999));
    expect(product).toBeNull();
  });

  it('obtiene la lista de categorías únicas', async () => {
    const categories = await firstValueFrom(service.getCategories());
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('electrónica');
  });

  it('los productos tienen ids únicos', () => {
    const ids = new Set(PRODUCTS.map((p) => p.id));
    expect(ids.size).toBe(PRODUCTS.length);
  });
});
