import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  IconArrowLeft,
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconShoppingBag,
  IconShoppingCart,
  IconTrash,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { Cart } from './cart';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/models/product.model';

const createProduct = (id: number, title: string, price: number, stock = 10): Product => ({
  id,
  title,
  price,
  stock,
  description: 'Descripción de prueba',
  category: 'hogar',
  rating: 4.5,
  thumbnail: `https://example.com/p${id}.webp`,
  discountPercentage: 0,
  tags: ['hogar'],
  brand: 'Brand',
  sku: `SKU-${id}`,
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: '1 month warranty',
  shippingInformation: 'Ships in 1 month',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30 days return policy',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-05-23T08:56:21.618Z',
    updatedAt: '2024-05-23T08:56:21.618Z',
    barcode: '1234567890',
    qrCode: 'qr',
  },
  images: [`https://example.com/p${id}.webp`],
});

describe('Cart Component', () => {
  let fixture: ComponentFixture<Cart>;
  let component: Cart;
  let cartService: CartService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        provideRouter([]),
        provideTablerIcons({
          IconArrowLeft,
          IconArrowRight,
          IconMinus,
          IconPlus,
          IconShoppingBag,
          IconShoppingCart,
          IconTrash,
        }),
      ],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    cartService.clearCart();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('muestra el estado vacío cuando el carrito no tiene productos', () => {
    const emptyCard = fixture.nativeElement.querySelector('.empty-cart-card');
    expect(emptyCard).toBeTruthy();
    expect(emptyCard.textContent).toContain('Tu carrito está vacío');
    expect(fixture.nativeElement.querySelector('.cart-layout')).toBeNull();
  });

  it('muestra los productos en el carrito cuando existen elementos', () => {
    cartService.addItem(createProduct(1, 'Jarrón de Cerámica', 25), 2);
    cartService.addItem(createProduct(2, 'Taza de Café', 15), 1);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.cart-item-card');
    expect(items.length).toBe(2);

    expect(fixture.nativeElement.textContent).toContain('Jarrón de Cerámica');
    expect(fixture.nativeElement.textContent).toContain('Taza de Café');
    expect(fixture.nativeElement.querySelector('.empty-cart-card')).toBeNull();
  });

  it('permite incrementar la cantidad de un ítem respetando el stock', () => {
    const prod = createProduct(1, 'Lámpara', 30, 5);
    cartService.addItem(prod, 1);
    fixture.detectChanges();

    component.onIncrement(1, 1, prod.stock);
    expect(cartService.items()[0].quantity).toBe(2);

    // Si ya alcanzó el stock máximo, no incrementa
    component.onIncrement(1, 5, prod.stock);
    expect(cartService.items()[0].quantity).toBe(2);
  });

  it('permite decrementar la cantidad o eliminar al llegar a cero', () => {
    cartService.addItem(createProduct(1, 'Lámpara', 30), 2);
    fixture.detectChanges();

    component.onDecrement(1, 2);
    expect(cartService.items()[0].quantity).toBe(1);

    component.onDecrement(1, 1);
    expect(cartService.items().length).toBe(0);
  });

  it('elimina un ítem directamente con onRemove', () => {
    cartService.addItem(createProduct(1, 'Producto A', 10), 1);
    cartService.addItem(createProduct(2, 'Producto B', 20), 1);
    fixture.detectChanges();

    component.onRemove(1);
    fixture.detectChanges();

    expect(cartService.items().length).toBe(1);
    expect(cartService.items()[0].product.id).toBe(2);
  });

  it('vacía el carrito completamente al invocar onClear', () => {
    cartService.addItem(createProduct(1, 'Producto A', 10), 3);
    cartService.addItem(createProduct(2, 'Producto B', 20), 2);
    fixture.detectChanges();

    component.onClear();
    fixture.detectChanges();

    expect(cartService.items().length).toBe(0);
    expect(fixture.nativeElement.querySelector('.empty-cart-card')).toBeTruthy();
  });

  it('muestra correctamente el resumen del pedido con cálculo de envío', () => {
    // Subtotal $40 (< $50) -> envío $5.99 -> total $45.99
    cartService.addItem(createProduct(1, 'Producto Menor', 40), 1);
    fixture.detectChanges();

    const summaryCard = fixture.nativeElement.querySelector('.summary-card');
    expect(summaryCard).toBeTruthy();
    expect(summaryCard.textContent).toContain('$40.00');
    expect(summaryCard.textContent).toContain('$5.99');
    expect(summaryCard.textContent).toContain('$45.99');

    // Al superar $50 -> envío gratis
    cartService.addItem(createProduct(2, 'Producto Extra', 20), 1);
    fixture.detectChanges();

    expect(summaryCard.textContent).toContain('Gratis');
    expect(summaryCard.textContent).toContain('$60.00');
  });
});
