import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TablerIconComponent } from '@tabler/icons-angular';
import { CartService } from '../../core/cart.service';
import { Button } from '../../components/atoms/button/button';
import { Image } from '../../components/atoms/image/image';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, Button, Image, TablerIconComponent, CurrencyPipe, TitleCasePipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  onIncrement(productId: number, currentQuantity: number, stock?: number) {
    if (stock !== undefined && currentQuantity >= stock) return;
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  onDecrement(productId: number, currentQuantity: number) {
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    } else {
      this.cartService.removeItem(productId);
    }
  }

  onRemove(productId: number) {
    this.cartService.removeItem(productId);
  }

  onClear() {
    this.cartService.clearCart();
  }

  onCheckout() {
    this.router.navigate(['/checkout']);
  }
}
