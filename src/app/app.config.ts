import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  IconCategory,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
  IconLayoutGrid,
  IconShoppingCart,
  IconUser,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideTablerIcons({
      IconCategory,
      IconChevronLeft,
      IconChevronRight,
      IconHome,
      IconLayoutGrid,
      IconShoppingCart,
      IconUser,
    }),
  ],
};
