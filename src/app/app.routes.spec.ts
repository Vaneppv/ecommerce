import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import {
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconCircleCheck,
  IconCreditCard,
  IconError404,
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
import { routes } from './app.routes';
import { NotFound } from './features/not-found/not-found';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class TestHostComponent {}

describe('App Routes - 404 Navigation', () => {
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter(routes),
        provideTablerIcons({
          IconError404,
          IconArrowLeft,
          IconShoppingCart,
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
          IconUser,
        }),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('debe navegar hacia la página 404 al acceder a una ruta inexistente', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const success = await router.navigate(['/ruta-inexistente-123']);
    expect(success).toBe(true);
    expect(router.url).toBe('/ruta-inexistente-123');

    fixture.detectChanges();
    const notFoundEl = (fixture.nativeElement as HTMLElement).querySelector('app-not-found');
    expect(notFoundEl).toBeTruthy();
  });

  it('redirige al login cuando un invitado intenta entrar al carrito', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/cart']);

    expect(router.url).toContain('/login');
    expect(router.url).toContain('returnUrl=%2Fcart');
    expect(router.url).toContain('reason=cart');
  });

  it('debe permitir navegar directamente a /not-found', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const success = await router.navigate(['/not-found']);
    expect(success).toBe(true);
    expect(router.url).toBe('/not-found');

    fixture.detectChanges();
    const notFoundEl = (fixture.nativeElement as HTMLElement).querySelector('app-not-found');
    expect(notFoundEl).toBeTruthy();
  });

  it('navega a checkout en lugar de resolverlo con la ruta comodín', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/checkout']);

    expect(router.routerState.snapshot.root.firstChild?.routeConfig?.path).toBe('checkout');
  });
});
