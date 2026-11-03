import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartBadge } from './components/atoms/cart-badge/cart-badge';

@Component({
  imports: [RouterOutlet, RouterLink, CartBadge],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
