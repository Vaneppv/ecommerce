import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  IconAlertTriangle,
  IconCategory,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconEyeOff,
  IconHome,
  IconInfoCircle,
  IconLayoutGrid,
  IconLock,
  IconLogout,
  IconMail,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconUserPlus,
  IconX,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { App } from './app';
import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

describe('App', () => {
  let cartService: CartService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTablerIcons({
          IconAlertTriangle,
          IconCategory,
          IconChevronLeft,
          IconChevronRight,
          IconCircleCheck,
          IconCircleX,
          IconEyeOff,
          IconHome,
          IconInfoCircle,
          IconLayoutGrid,
          IconLock,
          IconLogout,
          IconMail,
          IconSearch,
          IconShoppingCart,
          IconUser,
          IconUserPlus,
          IconX,
        }),
      ],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
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

  it('muestra la acción de inicio de sesión con icono y etiqueta', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const loginLink = fixture.nativeElement.querySelector('a.topbar-action') as HTMLAnchorElement;

    expect(loginLink.getAttribute('href')).toBe('/login');
    expect(loginLink.textContent).toContain('Iniciar sesión');
    expect(loginLink.querySelector('tabler-icon')).toBeTruthy();
  });

  it('debe reflejar la cantidad de productos del carrito en el header badge', () => {
    authService.login('demo@tienda.com', 'demo1234');
    cartService.clearCart();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const badgeCountEl = fixture.nativeElement.querySelector('.badge-count');
    expect(badgeCountEl.textContent).toContain('0');

    cartService.addItem({ id: 1, title: 'Item 1', price: 10 } as any, 3);
    fixture.detectChanges();

    expect(badgeCountEl.textContent).toContain('3');
  });

  it('abre el modal de confirmación al hacer clic en Cerrar sesión y no sale inmediatamente', () => {
    authService.login('demo@tienda.com', 'demo1234');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const logoutBtn = fixture.nativeElement.querySelector(
      'button.topbar-action',
    ) as HTMLButtonElement;
    expect(logoutBtn.textContent).toContain('Cerrar sesión');

    logoutBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance['isLogoutModalOpen']()).toBe(true);
    expect(authService.isLoggedIn()).toBe(true);
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeTruthy();
  });

  it('cierra el modal sin desloguear cuando se cancela', () => {
    authService.login('demo@tienda.com', 'demo1234');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    fixture.componentInstance.openLogoutModal();
    fixture.detectChanges();

    fixture.componentInstance.cancelLogout();
    fixture.detectChanges();

    expect(fixture.componentInstance['isLogoutModalOpen']()).toBe(false);
    expect(authService.isLoggedIn()).toBe(true);
  });

  it('busca desde el header preservando los filtros de la URL', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(App);

    fixture.componentInstance.onSearch('auriculares');

    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: { q: 'auriculares' },
      queryParamsHandling: 'merge',
    });
  });

  it('elimina el término de búsqueda del header al limpiarlo', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(App);

    fixture.componentInstance.onSearch('');

    expect(navigateSpy).toHaveBeenCalledWith(['/products'], {
      queryParams: { q: null },
      queryParamsHandling: 'merge',
    });
  });

  it('cierra la sesión, navega a productos y muestra la alerta al confirmar en el modal', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    authService.login('demo@tienda.com', 'demo1234');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    fixture.componentInstance.openLogoutModal();
    fixture.detectChanges();

    fixture.componentInstance.confirmLogout();
    fixture.detectChanges();

    expect(fixture.componentInstance['isLogoutModalOpen']()).toBe(false);
    expect(authService.isLoggedIn()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/products');

    const alertEl = fixture.nativeElement.querySelector('.top-notification-container app-alert');
    expect(alertEl).toBeTruthy();
    expect(alertEl.textContent).toContain(
      'Has cerrado sesión correctamente. Te has salido de tu cuenta',
    );
  });
});
