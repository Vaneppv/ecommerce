import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/catalog/catalog').then((m) => m.Catalog),
  },
  { path: '**', redirectTo: 'products' },
];
