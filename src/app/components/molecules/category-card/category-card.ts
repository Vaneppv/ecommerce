import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink, TablerIconComponent],
  styleUrl: './category-card.css',
  templateUrl: './category-card.html',
})
export class CategoryCard {
  label = input.required<string>();
  value = input.required<string>();
}
