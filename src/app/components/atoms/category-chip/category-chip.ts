import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-category-chip',
  standalone: true,
  templateUrl: './category-chip.html',
  styleUrl: './category-chip.css',
})
export class CategoryChip {
  label = input.required<string>();
  value = input.required<string>();
  active = input(false);
  selected = output<string>();
}
