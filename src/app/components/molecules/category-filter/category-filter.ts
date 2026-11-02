import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../atoms/button/button';

@Component({
  standalone: true,
  imports: [CommonModule, Button],
  selector: 'app-category-filter',
  styleUrl: './category-filter.css',
  templateUrl: './category-filter.html'
})
export class CategoryFilter {
  categories = input<string[]>(['electronics', 'roopa', 'hombre', 'mujer']);
  filteredCategories = input<string[]>([]);
  onCategoryChange = output<string>();
}