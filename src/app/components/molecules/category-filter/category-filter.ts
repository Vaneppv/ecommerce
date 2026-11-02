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
  categories = input<string[]>(['belleza', 'electrónica', 'hogar', 'ropa', 'deportes']);
  filteredCategories = input<string[]>([]);
  onCategoryChange = output<string>();
}