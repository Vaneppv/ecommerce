import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Image } from '../../atoms/image/image';
import { Button } from '../../atoms/button/button';

@Component({
  standalone: true,
  imports: [Image, Button, RouterLink, TablerIconComponent, TitleCasePipe, CurrencyPipe],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  productId = input<number>(0);
  productImage = input<string>('');
  productTitle = input<string>('');
  productPrice = input<string | number>('');
  productCategory = input<string>('');
  isFetching = input<boolean>(false);
  isOutOfStock = input<boolean>(false);

  onAddToCart = output<void>();
  onImageLoad = output<void>();
  onImageError = output<string>();
}
