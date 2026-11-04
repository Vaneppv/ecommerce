import { Component, input, output, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';

@Component({
  imports: [Input, Button],
  selector: 'app-search-form',
  styleUrl: './search-form.css',
  templateUrl: './search-form.html',
  standalone: true,
})
export class SearchForm {
  searchTerm = input<string>('');
  placeholder = input<string>('Buscar productos...');
  buttonVariant = input<'primary' | 'secondary' | 'ghost'>('primary');

  onSearch = output<string>();

  readonly localTerm = signal('');

  ngOnInit() {
    this.localTerm.set(this.searchTerm());
  }

  handleInput(value: string) {
    this.localTerm.set(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submit();
    }
  }

  submit() {
    this.onSearch.emit(this.localTerm().trim());
  }
}
