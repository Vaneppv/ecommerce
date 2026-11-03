import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconInfoCircle,
  IconSearch,
  IconShoppingCart,
  IconX,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideTablerIcons({
      IconAlertTriangle,
      IconArrowLeft,
      IconCheck,
      IconCircleCheck,
      IconCircleX,
      IconEye,
      IconInfoCircle,
      IconSearch,
      IconShoppingCart,
      IconX,
    }),
  ],
};
