import { Component, input, output } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  standalone: true,
  imports: [TablerIconComponent],
  selector: 'app-cart-badge',
  styleUrl: './cart-badge.css',
  templateUrl: './cart-badge.html'
})
export class CartBadge {
  count = input<number>(0);
  variant = input<'default' | 'secondary' | 'link'> ('default');
  onRemove = output<void>();
}
