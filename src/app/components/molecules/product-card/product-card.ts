import { Component, input, output } from '@angular/core';
import { Image } from '../../atoms/image/image';
import { Button } from '../../atoms/button/button';
import { CardModule } from 'primeng/card';
import { TitleCasePipe, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [CardModule, Image, Button, TitleCasePipe, CurrencyPipe],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html'
})
export class ProductCard {
  productImage = input<string>('');
  productTitle = input<string>('');
  productPrice = input<string>('');
  isFetching = input<boolean>(false);
  isOutOfStock = input<boolean>(false);

  onAddToCart = output<any>();
  onQuickView = output<any>();
  onImageLoad = output<void>();
  onImageError = output<string>();
}
