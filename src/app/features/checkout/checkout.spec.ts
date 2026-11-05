import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconCircleCheck,
  IconCreditCard,
  IconLayoutGrid,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShoppingBag,
  IconShoppingCart,
  IconUser,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/models/product.model';
import { Checkout } from './checkout';

const product = {
  id: 1,
  title: 'Lámpara de Mesa',
  price: 30,
  stock: 10,
  thumbnail: 'https://example.com/p1.webp',
} as Product;

describe('Checkout', () => {
  let fixture: ComponentFixture<Checkout>;
  let el: HTMLElement;
  let cart: CartService;

  const field = (id: string) => el.querySelector<HTMLInputElement>(`#checkout-${id}`)!;

  const type = (id: string, value: string) => {
    const input = field(id);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  const fillValidForm = () => {
    type('phone', '0414 1234567');
    type('address', 'Av. Principal 123');
    type('city', 'Caracas');
    type('postalCode', '1010');
    type('cardName', 'MARIA PEREZ');
    type('cardNumber', '4111111111111111');
    type('expiry', '1299');
    type('cvv', '123');
    const terms = field('terms');
    terms.checked = true;
    terms.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  const submit = () => {
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        provideRouter([]),
        provideTablerIcons({
          IconArrowLeft,
          IconBuilding,
          IconCalendar,
          IconCircleCheck,
          IconCreditCard,
          IconLayoutGrid,
          IconLock,
          IconMail,
          IconMapPin,
          IconPhone,
          IconShoppingBag,
          IconShoppingCart,
          IconUser,
        }),
      ],
    }).compileComponents();

    TestBed.inject(AuthService).login('demo@tienda.com', 'demo1234');
    cart = TestBed.inject(CartService);
    cart.clearCart();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const create = () => {
    fixture = TestBed.createComponent(Checkout);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  };

  it('muestra un estado vacío si el carrito no tiene productos', () => {
    create();
    expect(el.querySelector('.empty-card')).toBeTruthy();
    expect(el.querySelector('form')).toBeNull();
  });

  it('precarga nombre y correo del usuario autenticado', () => {
    cart.addItem(product, 1);
    create();
    expect(field('fullName').value).toBe('Demo');
    expect(field('email').value).toBe('demo@tienda.com');
  });

  it('muestra errores y no procesa la compra si el formulario es inválido', () => {
    cart.addItem(product, 1);
    create();

    submit();

    expect(el.querySelectorAll('.form-error').length).toBeGreaterThanOrEqual(6);
    expect(el.textContent).toContain('Este campo es obligatorio.');
    expect(el.textContent).toContain('Debes aceptar los términos para continuar.');
    expect(el.querySelector('.confirmation-card')).toBeNull();
    expect(cart.items().length).toBe(1);
  });

  it('rechaza una tarjeta con número inválido y una fecha vencida', () => {
    cart.addItem(product, 1);
    create();

    type('cardNumber', '4111111111111112');
    type('expiry', '0120');
    field('cardNumber').dispatchEvent(new Event('blur'));
    field('expiry').dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(el.textContent).toContain('Número de tarjeta inválido.');
    expect(el.textContent).toContain('Fecha inválida o vencida (usa MM/AA).');
  });

  it('da formato al número de tarjeta y a la fecha mientras se escribe', () => {
    cart.addItem(product, 1);
    create();

    type('cardNumber', '4111111111111111');
    type('expiry', '1230');

    expect(field('cardNumber').value).toBe('4111 1111 1111 1111');
    expect(field('expiry').value).toBe('12/30');
  });

  it('confirma el pedido, muestra el resumen y vacía el carrito con datos válidos', () => {
    cart.addItem(product, 2);
    create();

    fillValidForm();
    submit();
    expect(el.querySelector('.confirmation-card')).toBeNull(); // procesando

    vi.advanceTimersByTime(1200);
    fixture.detectChanges();

    const confirmation = el.querySelector('.confirmation-card');
    expect(confirmation).toBeTruthy();
    expect(confirmation!.textContent).toContain('¡Gracias por tu compra!');
    expect(confirmation!.textContent).toContain('ORD-');
    expect(confirmation!.textContent).toContain('1111');
    expect(confirmation!.textContent).toContain('$60.00');
    expect(cart.items().length).toBe(0);
  });
});
