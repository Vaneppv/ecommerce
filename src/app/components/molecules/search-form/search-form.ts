import { Component, input, output } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Input } from '../../atoms/input/input';

@Component({
  imports: [Input, Button],
  selector: 'app-search-form',
  styleUrl: './search-form.css',
  templateUrl: './search-form.html',
  standalone: true
})
export class SearchForm {
  searchTerm = input<string>('');
  onSearch = output<string>();
  performSearch = output<void>();
}
