import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IconArrowLeft, IconShoppingCart, provideTablerIcons } from '@tabler/icons-angular';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/product-service';
import { CartService } from '../../../core/cart.service';
import { ProductDetail } from './detail';

const mockProduct: Product = {
  id: 1,
  title: 'Producto de Prueba',
  description: 'Descripción detallada',
  category: 'electrónica',
  price: 99.99,
  rating: 4.8,
  thumbnail: 'https://example.com/test.jpg',
  discountPercentage: 10,
  stock: 5,
  tags: ['electrónica'],
  brand: 'TestBrand',
  sku: 'TEST-SKU-1',
  weight: 2,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: '1 año de garantía',
  shippingInformation: 'Envío gratis',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30 días de devolución',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  images: ['https://example.com/test.jpg'],
};

describe('ProductDetail', () => {
  let fixture: ComponentFixture<ProductDetail>;
  let component: ProductDetail;
  let productServiceMock: { getProductById: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productServiceMock = {
      getProductById: vi.fn().mockReturnValue(of(mockProduct)),
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        provideRouter([]),
        provideTablerIcons({ IconArrowLeft, IconShoppingCart }),
        { provide: ProductService, useValue: productServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '1']])),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga y muestra la información del producto', () => {
    expect(productServiceMock.getProductById).toHaveBeenCalledWith(1);
    expect(component.product()).toEqual(mockProduct);
    expect(component.loading()).toBe(false);

    const titleEl = fixture.nativeElement.querySelector('.product-title');
    expect(titleEl.textContent).toContain('Producto de Prueba');
  });

  it('permite incrementar y decrementar la cantidad dentro del stock disponible', () => {
    expect(component.quantity()).toBe(1);

    component.incrementQuantity();
    expect(component.quantity()).toBe(2);

    component.decrementQuantity();
    expect(component.quantity()).toBe(1);

    component.decrementQuantity();
    expect(component.quantity()).toBe(1); // Mínimo 1
  });

  it('muestra aviso y añade el producto con su cantidad al CartService', () => {
    const cartService = TestBed.inject(CartService);
    cartService.clearCart();

    component.incrementQuantity();
    component.addToCart();

    expect(component.notice()).toContain('Producto de Prueba');
    expect(cartService.totalCount()).toBe(2);
    expect(cartService.items()[0].quantity).toBe(2);
    expect(cartService.items()[0].product.id).toBe(mockProduct.id);
  });

  it('muestra mensaje de error cuando el producto no se encuentra', () => {
    productServiceMock.getProductById.mockReturnValue(of(null));
    component.loadProduct(999);
    fixture.detectChanges();

    expect(component.error()).toBe('Producto no encontrado');
    expect(component.product()).toBeNull();
  });
});
