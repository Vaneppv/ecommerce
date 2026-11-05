import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/product-service';
import { CartService } from '../../../core/cart.service';
import { Catalog } from './catalog';

const item = (id: number): Product => ({
  id,
  title: `Producto ${id}`,
  description: `Descripción del producto ${id}`,
  category: 'hogar',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 10,
  tags: ['hogar'],
  brand: 'Marca',
  sku: `SKU-${id}`,
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: '',
  shippingInformation: '',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  thumbnail: `https://example.com/${id}.webp`,
  images: [],
});

function setup(getPage: ProductService['getPage']) {
  TestBed.configureTestingModule({
    imports: [Catalog],
    providers: [
      provideRouter([]),
      {
        provide: ProductService,
        useValue: {
          getPage,
          getCategories: () => of(['electrónica', 'hogar', 'ropa', 'deportes']),
        },
      },
    ],
  });
  const router = TestBed.inject(Router);
  vi.spyOn(router, 'navigate').mockResolvedValue(true);
  return TestBed.createComponent(Catalog).componentInstance;
}

describe('Catalog', () => {
  it('carga la primera página al crearse', () => {
    const catalog = setup(() => of({ products: [item(1), item(2)], total: 4, skip: 0, limit: 20 }));
    expect(catalog.products().length).toBe(2);
    expect(catalog.hasMore()).toBe(true);
    expect(catalog.loading()).toBe(false);
    expect(catalog.categories().length).toBe(4);
  });

  it('indica que no hay más cuando se cargó todo', () => {
    const catalog = setup(() => of({ products: [item(1), item(2)], total: 2, skip: 0, limit: 20 }));
    expect(catalog.hasMore()).toBe(false);
  });

  it('muestra error si falla la carga', () => {
    const catalog = setup(() => throwError(() => new Error('fail')));
    expect(catalog.error()).toBeTruthy();
    expect(catalog.loading()).toBe(false);
  });

  it('muestra un aviso y agrega el producto al CartService al agregar al carrito', () => {
    const catalog = setup(() => of({ products: [item(1)], total: 1, skip: 0, limit: 20 }));
    const auth = TestBed.inject(AuthService);
    const cartService = TestBed.inject(CartService);
    auth.login('demo@tienda.com', 'demo1234');
    cartService.clearCart();

    catalog.addToCart(item(1));
    expect(catalog.notice()).toContain('Producto 1');
    expect(cartService.totalCount()).toBe(1);
    expect(cartService.items()[0].product.id).toBe(1);
  });

  it('actualiza categoría y resetea productos al llamar setCategory', () => {
    const catalog = setup(() => of({ products: [item(1)], total: 1, skip: 0, limit: 20 }));
    catalog.setCategory('ropa');
    expect(catalog.selectedCategory()).toBe('ropa');
  });

  it('limpia la búsqueda manteniendo la categoría seleccionada', () => {
    const catalog = setup(() => of({ products: [item(1)], total: 1, skip: 0, limit: 20 }));
    const router = TestBed.inject(Router);

    catalog.clearSearch();

    expect(router.navigate).toHaveBeenCalledWith(['/products'], {
      queryParams: { q: null },
      queryParamsHandling: 'merge',
    });
  });

  it('sincroniza la categoría seleccionada con la URL', () => {
    const catalog = setup(() => of({ products: [item(1)], total: 1, skip: 0, limit: 20 }));
    const router = TestBed.inject(Router);

    catalog.setCategory('ropa');

    expect(catalog.selectedCategory()).toBe('ropa');
    expect(router.navigate).toHaveBeenCalledWith(['/products'], {
      queryParams: { category: 'ropa' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });
});
