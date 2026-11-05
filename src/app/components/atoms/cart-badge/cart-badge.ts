import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  standalone: true,
  imports: [TablerIconComponent, RouterLink],
  selector: 'app-cart-badge',
  styleUrl: './cart-badge.css',
  templateUrl: './cart-badge.html',
})
export class CartBadge {
  count = input<number>(0);
  label = input<string>('Carrito');
  variant = input<'default' | 'secondary' | 'link'>('default');
  onRemove = output<void>();

  readonly ariaLabel = computed(() => {
    const count = this.count();
    return count === 1
      ? 'Ver carrito de compras, 1 producto'
      : `Ver carrito de compras, ${count} productos`;
  });
}
