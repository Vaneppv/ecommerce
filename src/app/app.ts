import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { SearchForm } from './components/molecules/search-form/search-form';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TablerIconComponent, SearchForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  private readonly router = inject(Router);

  onSearch(term: string) {
    this.router.navigate(['/products'], { queryParams: term ? { q: term } : {} });
  }
}
