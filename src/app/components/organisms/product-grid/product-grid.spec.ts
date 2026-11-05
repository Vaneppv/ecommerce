import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IconEye, provideTablerIcons } from '@tabler/icons-angular';
import { Product } from '../../../core/models/product.model';
import { ProductGrid } from './product-grid';

const item = (id: number): Product => ({
  id,
  title: `Producto ${id}`,
  description: `Descripción del producto ${id}`,
  category: 'hogar',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 10,
  tags: ['hogar'],
  brand: 'Marca',
  sku: `SKU-${id}`,
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: '',
  shippingInformation: '',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  thumbnail: `https://example.com/${id}.webp`,
  images: [],
});

function setup() {
  TestBed.configureTestingModule({
    imports: [ProductGrid],
    providers: [provideRouter([]), provideTablerIcons({ IconEye })],
  });

  return TestBed.createComponent(ProductGrid);
}

function skeletonCount(fixture: ReturnType<typeof setup>): number {
  return fixture.nativeElement.querySelectorAll('app-product-card-skeleton').length;
}

describe('ProductGrid', () => {
  it('muestra 8 skeletons durante la carga inicial', () => {
    const fixture = setup();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(skeletonCount(fixture)).toBe(8);
  });

  it('mantiene los productos y agrega 4 skeletons al cargar más', () => {
    const fixture = setup();
    fixture.componentRef.setInput('products', [item(1), item(2)]);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-product-card').length).toBe(2);
    expect(skeletonCount(fixture)).toBe(4);
  });

  it('no muestra skeletons cuando terminó la carga', () => {
    const fixture = setup();
    fixture.componentRef.setInput('products', [item(1)]);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    expect(skeletonCount(fixture)).toBe(0);
  });

  it('expone aria-busy según el estado de carga', () => {
    const fixture = setup();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('ul.grid') as HTMLUListElement;
    expect(grid.getAttribute('aria-busy')).toBe('true');

    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    expect(grid.getAttribute('aria-busy')).toBe('false');
  });
});
