import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IconShoppingCart, provideTablerIcons } from '@tabler/icons-angular';
import { CartBadge } from './cart-badge';

describe('CartBadge Atom', () => {
  let fixture: ComponentFixture<CartBadge>;
  let component: CartBadge;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartBadge],
      providers: [provideRouter([]), provideTablerIcons({ IconShoppingCart })],
    }).compileComponents();

    fixture = TestBed.createComponent(CartBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea sin errores de inyección y muestra el contador', () => {
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();

    const countEl = fixture.nativeElement.querySelector('.badge-count');
    expect(countEl.textContent.trim()).toBe('3');
  });

  it('tiene el enlace configurado a /cart', () => {
    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/cart');
  });

  it('muestra la etiqueta Carrito y un aria-label con el conteo', () => {
    fixture.componentRef.setInput('label', 'Carrito');
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    const label = fixture.nativeElement.querySelector('.badge-label');

    expect(label.textContent.trim()).toBe('Carrito');
    expect(link.getAttribute('aria-label')).toBe('Ver carrito de compras, 3 productos');
  });
});
