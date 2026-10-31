import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-cart-badge',
  styleUrl: './cart-badge.css',
  templateUrl: './cart-badge.html',
  standalone: true,
})
export class CartBadge {
  count = input<number>(0);
  variant = input<'default' | 'secondary' | 'link'> ('default');
  onRemove = output<void>();
}
