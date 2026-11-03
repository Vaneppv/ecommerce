import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-input',
  styleUrl: './input.css',
  templateUrl: './input.html',
  standalone: true,
})
export class Input {
  type = input<'text' | 'search' | 'number' | 'email' | 'password'>('text');
  placeholder = input<string>('');
  value = input<string>('');
  disabled = input<boolean>(false);

  onInput = output<string>();
  onBlur = output<void>();
  onFocus = output<void>();

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.onInput.emit(target?.value ?? '');
  }
}
