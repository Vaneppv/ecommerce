import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCategory,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconHome,
  IconInfoCircle,
  IconLayoutGrid,
  IconMinus,
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconShoppingCart,
  IconTrash,
  IconUser,
  IconX,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideTablerIcons({
      IconAlertTriangle,
      IconArrowLeft,
      IconArrowRight,
      IconCategory,
      IconCheck,
      IconChevronLeft,
      IconChevronRight,
      IconCircleCheck,
      IconCircleX,
      IconEye,
      IconHome,
      IconInfoCircle,
      IconLayoutGrid,
      IconMinus,
      IconPlus,
      IconSearch,
      IconShoppingBag,
      IconShoppingCart,
      IconTrash,
      IconUser,
      IconX,
    }),
  ],
};
