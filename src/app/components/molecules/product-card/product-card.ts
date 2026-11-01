import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../../../core/models/product';
import { Image } from '../../atoms/image/image';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, Image],
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  onAdd = output<Product>();
}
