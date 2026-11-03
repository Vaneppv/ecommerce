import { TestBed } from '@angular/core/testing';
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

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('inicia con un carrito vacío y totales en 0', () => {
    expect(service.items()).toEqual([]);
    expect(service.totalCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
    expect(service.shipping()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('agrega un nuevo producto al carrito', () => {
    const product = createProduct(1, 20.5);
    service.addItem(product, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].product.id).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.totalCount()).toBe(2);
    expect(service.subtotal()).toBe(41);
    expect(service.shipping()).toBe(5.99); // Subtotal < 50
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
    const product = createProduct(1, 30);
    service.addItem(product, 2); // Subtotal = 60

    expect(service.subtotal()).toBe(60);
    expect(service.shipping()).toBe(0);
    expect(service.total()).toBe(60);
  });

  it('remueve un producto por su id', () => {
    const p1 = createProduct(1, 10);
    const p2 = createProduct(2, 25);
    service.addItem(p1, 1);
    service.addItem(p2, 1);

    expect(service.items().length).toBe(2);

    service.removeItem(1);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].product.id).toBe(2);
    expect(service.totalCount()).toBe(1);
  });

  it('actualiza la cantidad de un producto existente', () => {
    const product = createProduct(1, 12);
    service.addItem(product, 2);

    service.updateQuantity(1, 5);

    expect(service.items()[0].quantity).toBe(5);
    expect(service.subtotal()).toBe(60);
  });

  it('elimina el producto si la cantidad se actualiza a 0 o menor', () => {
    const product = createProduct(1, 10);
    service.addItem(product, 2);

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

  it('persiste los cambios en localStorage y los recupera al reinicializarse', () => {
    const product = createProduct(1, 19.99);
    service.addItem(product, 3);

    // Verificamos que se haya guardado en localStorage
    const saved = localStorage.getItem('ecommerce_cart');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)[0].quantity).toBe(3);

    // Creamos una nueva instancia del servicio para simular recarga de página
    const newService = new CartService();
    expect(newService.items().length).toBe(1);
    expect(newService.items()[0].product.id).toBe(1);
    expect(newService.items()[0].quantity).toBe(3);
    expect(newService.totalCount()).toBe(3);
  });
});
