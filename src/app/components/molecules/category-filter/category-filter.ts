import { Component, input, output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CategoryChip } from '../../atoms/category-chip/category-chip';

@Component({
  standalone: true,
  imports: [TitleCasePipe, CategoryChip],
  selector: 'app-category-filter',
  styleUrl: './category-filter.css',
  templateUrl: './category-filter.html',
})
export class CategoryFilter {
  categories = input<string[]>([]);
  selectedCategory = input<string>('todas');
  onCategoryChange = output<string>();

  isAllSelected(): boolean {
    return !this.selectedCategory() || this.selectedCategory() === 'todas';
  }

  isSelected(category: string): boolean {
    return this.selectedCategory().toLowerCase() === category.toLowerCase();
  }
}
