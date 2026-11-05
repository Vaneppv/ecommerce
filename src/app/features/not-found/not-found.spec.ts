import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  IconArrowLeft,
  IconError404,
  IconShoppingCart,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { NotFound } from './not-found';

describe('NotFound Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [
        provideRouter([]),
        provideTablerIcons({ IconError404, IconArrowLeft, IconShoppingCart }),
      ],
    }).compileComponents();
  });

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(NotFound);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe renderizar el título de página no encontrada y el badge 404', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Página no encontrada');
  });

  it('debe contener enlaces de navegación hacia el catálogo y el carrito', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const links = compiled.querySelectorAll('a');
    expect(links.length).toBe(2);

    const catalogLink = links[0];
    const cartLink = links[1];

    expect(catalogLink.getAttribute('routerLink') || catalogLink.getAttribute('href')).toContain(
      '/products',
    );
    expect(catalogLink.textContent).toContain('Volver al catálogo');

    expect(cartLink.getAttribute('routerLink') || cartLink.getAttribute('href')).toContain('/cart');
    expect(cartLink.textContent).toContain('Ver mi carrito');
  });
});
