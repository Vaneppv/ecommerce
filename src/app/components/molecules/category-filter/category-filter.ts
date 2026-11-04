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
  filteredCategories = input<string[]>([]);
  onCategoryChange = output<string>();

  isAllSelected(): boolean {
    return this.filteredCategories().length === 0;
  }
}
