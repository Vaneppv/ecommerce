import { Component, input, output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [TitleCasePipe],
  selector: 'app-category-filter',
  styleUrl: './category-filter.css',
  templateUrl: './category-filter.html',
})
export class CategoryFilter {
  categories = input<string[]>([]);
  selectedCategory = input<string>('todas');
  onCategoryChange = output<string>();
}
