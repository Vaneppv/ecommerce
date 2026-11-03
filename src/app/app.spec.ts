import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IconShoppingCart, provideTablerIcons } from '@tabler/icons-angular';
import { App } from './app';
import { CartService } from './core/cart.service';

describe('App', () => {
  let cartService: CartService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideTablerIcons({ IconShoppingCart })],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    cartService.clearCart();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('header')).toBeTruthy();
  });

  it('debe reflejar la cantidad de productos del carrito en el header badge', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const badgeCountEl = fixture.nativeElement.querySelector('.badge-count');
    expect(badgeCountEl.textContent).toContain('0');

    cartService.addItem({ id: 1, title: 'Item 1', price: 10 } as any, 3);
    fixture.detectChanges();

    expect(badgeCountEl.textContent).toContain('3');
  });
});
