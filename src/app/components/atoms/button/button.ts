import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
  standalone: true,
})
export class Button {
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  size = input<'small' | 'medium' | 'large' | 'extra-small'>('medium');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  onClick = output<void>();
}
