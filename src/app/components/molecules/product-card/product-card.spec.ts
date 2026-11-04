import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IconEye, provideTablerIcons } from '@tabler/icons-angular';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;
  let component: ProductCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([]), provideTablerIcons({ IconEye })],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productId', 1);
    fixture.componentRef.setInput('productImage', 'https://example.com/product.webp');
    fixture.componentRef.setInput('productTitle', 'Producto de prueba');
    fixture.componentRef.setInput('productPrice', 19.99);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra el título y el precio del producto', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Producto De Prueba');
    expect(text).toContain('$19.99');
  });

  it('emite onAddToCart y muestra el feedback de éxito en el botón', () => {
    vi.useFakeTimers();
    let emitted = 0;
    component.onAddToCart.subscribe(() => emitted++);

    const button = fixture.nativeElement.querySelector('app-button button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(emitted).toBe(1);
    expect(button.classList.contains('is-success')).toBe(true);
    expect(button.querySelector('.btn-feedback')?.textContent).toContain('Agregado');
  });

  it('no emite ni muestra feedback cuando el producto está agotado', () => {
    fixture.componentRef.setInput('isOutOfStock', true);
    fixture.detectChanges();

    let emitted = 0;
    component.onAddToCart.subscribe(() => emitted++);

    const button = fixture.nativeElement.querySelector('app-button button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(emitted).toBe(0);
    expect(button.querySelector('.btn-feedback')).toBeNull();
  });
});
