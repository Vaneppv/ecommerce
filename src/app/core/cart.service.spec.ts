import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { Product } from './models/product.model';

const createProduct = (id: number, price: number, title = `Producto ${id}`): Product => ({
  id,
  title,
  description: 'Descripción de prueba',
  category: 'electrónica',
  price,
  rating: 4.5,
  thumbnail: `https://example.com/p${id}.jpg`,
  discountPercentage: 0,
  stock: 10,
  tags: ['electrónica'],
  brand: 'Marca',
  sku: `SKU-${id}`,
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: 'Garantía',
  shippingInformation: 'Envío',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: 'Devolución',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  images: [`https://example.com/p${id}.jpg`],
});

const loginDemo = (auth: AuthService) => auth.login('demo@tienda.com', 'demo1234');

describe('CartService', () => {
  let service: CartService;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('sin sesión', () => {
    it('inicia con un carrito vacío y totales en 0', () => {
      expect(service.items()).toEqual([]);
      expect(service.totalCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
      expect(service.shipping()).toBe(0);
      expect(service.total()).toBe(0);
    });

    it('no permite agregar productos como invitado', () => {
      service.addItem(createProduct(1, 10), 2);

      expect(service.items()).toEqual([]);
      expect(service.totalCount()).toBe(0);
      expect(localStorage.getItem('ecommerce_carts')).toBeNull();
    });

    it('no permite modificar ni vaciar un carrito inexistente', () => {
      service.removeItem(1);
      service.updateQuantity(1, 3);
      service.clearCart();

      expect(service.items()).toEqual([]);
    });
  });

  describe('con sesión iniciada', () => {
    beforeEach(() => {
      loginDemo(auth);
    });

    it('agrega un nuevo producto al carrito del usuario', () => {
      service.addItem(createProduct(1, 20.5), 2);

      expect(service.owner()).toBe('demo@tienda.com');
      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(1);
      expect(service.items()[0].quantity).toBe(2);
      expect(service.totalCount()).toBe(2);
      expect(service.subtotal()).toBe(41);
      expect(service.shipping()).toBe(5.99);
      expect(service.total()).toBe(46.99);
    });

    it('incrementa la cantidad si el producto ya existe en el carrito', () => {
      const product = createProduct(1, 15);
      service.addItem(product, 1);
      service.addItem(product, 2);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(3);
      expect(service.totalCount()).toBe(3);
      expect(service.subtotal()).toBe(45);
    });

    it('ignora adiciones con cantidad menor o igual a cero', () => {
      const product = createProduct(1, 10);
      service.addItem(product, 0);
      service.addItem(product, -2);

      expect(service.items().length).toBe(0);
    });

    it('aplica envío gratis cuando el subtotal es mayor o igual a $50', () => {
      service.addItem(createProduct(1, 30), 2);

      expect(service.subtotal()).toBe(60);
      expect(service.shipping()).toBe(0);
      expect(service.total()).toBe(60);
    });

    it('remueve un producto por su id', () => {
      service.addItem(createProduct(1, 10), 1);
      service.addItem(createProduct(2, 25), 1);

      expect(service.items().length).toBe(2);

      service.removeItem(1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(2);
      expect(service.totalCount()).toBe(1);
    });

    it('actualiza la cantidad de un producto existente', () => {
      service.addItem(createProduct(1, 12), 2);

      service.updateQuantity(1, 5);

      expect(service.items()[0].quantity).toBe(5);
      expect(service.subtotal()).toBe(60);
    });

    it('elimina el producto si la cantidad se actualiza a 0 o menor', () => {
      service.addItem(createProduct(1, 10), 2);

      service.updateQuantity(1, 0);

      expect(service.items().length).toBe(0);
      expect(service.totalCount()).toBe(0);
    });

    it('vacía el carrito completamente con clearCart', () => {
      service.addItem(createProduct(1, 10), 2);
      service.addItem(createProduct(2, 20), 1);

      expect(service.items().length).toBe(2);

      service.clearCart();

      expect(service.items()).toEqual([]);
      expect(service.totalCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
    });

    it('persiste en ecommerce_carts y recupera el carrito al reinicializarse', () => {
      service.addItem(createProduct(1, 19.99), 3);

      const saved = JSON.parse(localStorage.getItem('ecommerce_carts') || '{}');
      expect(saved['demo@tienda.com'][0].quantity).toBe(3);

      // Simulamos una recarga completa de la aplicación.
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});

      const reloadedAuth = TestBed.inject(AuthService);
      expect(reloadedAuth.isLoggedIn()).toBe(true);

      const reloaded = TestBed.inject(CartService);
      expect(reloaded.items().length).toBe(1);
      expect(reloaded.items()[0].product.id).toBe(1);
      expect(reloaded.items()[0].quantity).toBe(3);
      expect(reloaded.totalCount()).toBe(3);
    });

    it('mantiene carritos separados entre usuarios', () => {
      service.addItem(createProduct(1, 10), 2);
      auth.logout();

      auth.register('Otro Usuario', 'otro@tienda.com', 'secreto123');
      service.addItem(createProduct(2, 20), 1);

      expect(service.owner()).toBe('otro@tienda.com');
      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(2);

      auth.logout();
      loginDemo(auth);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(1);
      expect(service.items()[0].quantity).toBe(2);
    });

    it('oculta el carrito al cerrar sesión y lo conserva para el mismo usuario', () => {
      service.addItem(createProduct(1, 10), 1);
      auth.logout();

      expect(service.items()).toEqual([]);
      expect(service.totalCount()).toBe(0);
      expect(service.owner()).toBeNull();

      loginDemo(auth);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(1);
      expect(service.items()[0].quantity).toBe(1);
    });
  });

  describe('migración del carrito antiguo', () => {
    it('asigna ecommerce_cart al usuario ya autenticado al crear el servicio', () => {
      TestBed.resetTestingModule();
      localStorage.clear();

      const legacyProduct = createProduct(7, 12);
      localStorage.setItem(
        'ecommerce_cart',
        JSON.stringify([{ product: legacyProduct, quantity: 2 }]),
      );

      TestBed.configureTestingModule({});
      const migratedAuth = TestBed.inject(AuthService);
      loginDemo(migratedAuth);

      const migratedService = TestBed.inject(CartService);

      expect(migratedService.items().length).toBe(1);
      expect(migratedService.items()[0].product.id).toBe(7);
      expect(migratedService.items()[0].quantity).toBe(2);
      expect(localStorage.getItem('ecommerce_cart')).toBeNull();

      const saved = JSON.parse(localStorage.getItem('ecommerce_carts') || '{}');
      expect(saved['demo@tienda.com'][0].quantity).toBe(2);
    });

    it('asigna ecommerce_cart cuando el usuario inicia sesión después', () => {
      localStorage.setItem(
        'ecommerce_cart',
        JSON.stringify([{ product: createProduct(9, 5), quantity: 4 }]),
      );

      loginDemo(auth);
      TestBed.tick();

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(9);
      expect(service.items()[0].quantity).toBe(4);
      expect(localStorage.getItem('ecommerce_cart')).toBeNull();
    });
  });
});
