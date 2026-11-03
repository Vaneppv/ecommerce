import { Component, input, output, signal } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';

@Component({
  imports: [Input, Button, TablerIconComponent],
  selector: 'app-search-form',
  styleUrl: './search-form.css',
  templateUrl: './search-form.html',
  standalone: true,
})
export class SearchForm {
  searchTerm = input<string>('');
  placeholder = input<string>('Buscar productos...');

  onSearch = output<string>();

  readonly localTerm = signal('');

  ngOnInit() {
    this.localTerm.set(this.searchTerm());
  }

  handleInputChange(val: string) {
    this.localTerm.set(val);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submitSearch();
    }
  }

  submitSearch() {
    this.onSearch.emit(this.localTerm().trim());
  }

  clearSearch() {
    this.localTerm.set('');
    this.onSearch.emit('');
  }
}
