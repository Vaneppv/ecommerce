import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { CartAccessService } from './cart-access.service';
import { CartService } from './cart.service';
import { Product } from './models/product.model';

const product: Product = {
  id: 1,
  title: 'Producto',
  description: '',
  category: 'hogar',
  price: 10,
  discountPercentage: 0,
  rating: 5,
  stock: 5,
  tags: [],
  brand: 'Marca',
  sku: 'SKU-1',
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: '',
  shippingInformation: '',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  thumbnail: 'https://example.com/1.webp',
  images: [],
};

describe('CartAccessService', () => {
  let service: CartAccessService;
  let auth: AuthService;
  let cart: CartService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(CartAccessService);
    auth = TestBed.inject(AuthService);
    cart = TestBed.inject(CartService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('redirige al login cuando un invitado intenta agregar al carrito', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const result = service.add(product);

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: router.url, reason: 'cart' },
    });
    expect(cart.items()).toEqual([]);
  });

  it('agrega el producto cuando el usuario tiene sesión iniciada', () => {
    auth.login('demo@tienda.com', 'demo1234');

    const result = service.add(product, 3);

    expect(result).toBe(true);
    expect(cart.items().length).toBe(1);
    expect(cart.items()[0].product.id).toBe(1);
    expect(cart.items()[0].quantity).toBe(3);
  });
});
