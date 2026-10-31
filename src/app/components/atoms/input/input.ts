import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-input',
  styleUrl: './input.css',
  templateUrl: './input.html',
  standalone: true
})
export class Input {
  type = input<'text' | 'search' | 'number' | 'email' | 'password'> ('text');
  placeholder = input<string> ('');
  value = input<string> ('');
  disabled = input<boolean> (false);

  onInput = output<string>(); // emits new value on input
  onBlur = output<void>();    // emits on blur
  onFocus = output<void>();   // emits on focus
}
