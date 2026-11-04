import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  IconCategory,
  IconChevronLeft,
  IconChevronRight,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { of } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/product-service';
import { Home } from './home';

const product: Product = {
  id: 1,
  title: 'Producto',
  description: '',
  category: 'hogar',
  price: 10,
  discountPercentage: 0,
  rating: 5,
  stock: 5,
  tags: [],
  brand: 'Marca',
  sku: 'SKU-1',
  weight: 1,
  dimensions: { width: 1, height: 1, depth: 1 },
  warrantyInformation: '',
  shippingInformation: '',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  thumbnail: 'https://example.com/1.webp',
  images: [],
};

describe('Home', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        provideTablerIcons({ IconCategory, IconChevronLeft, IconChevronRight }),
        {
          provide: ProductService,
          useValue: {
            getPopular: () => of([product]),
            getCategories: () => of(['hogar', 'ropa']),
          },
        },
      ],
    });
  });

  it('carga los productos populares y las categorías', () => {
    const home = TestBed.createComponent(Home).componentInstance;

    expect(home.popular()).toEqual([product]);
    expect(home.categories()).toEqual(['hogar', 'ropa']);
    expect(home.loadingPopular()).toBe(false);
  });

  it('formatea los nombres de categoría', () => {
    const home = TestBed.createComponent(Home).componentInstance;
    expect(home.formatCategory('home-decoration')).toBe('home decoration');
  });
});
