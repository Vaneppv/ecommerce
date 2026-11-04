import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/catalog/catalog').then((m) => m.Catalog),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/detail/detail').then((m) => m.ProductDetail),
  },
  { path: '**', redirectTo: '' },
];
