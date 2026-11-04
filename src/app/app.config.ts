import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconError404,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconLock,
  IconLogout,
  IconMail,
  IconMinus,
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconShoppingCart,
  IconTrash,
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
      IconArrowRight,
      IconCheck,
      IconCircleCheck,
      IconCircleX,
      IconError404,
      IconEye,
      IconEyeOff,
      IconInfoCircle,
      IconLock,
      IconLogout,
      IconMail,
      IconMinus,
      IconPlus,
      IconSearch,
      IconShoppingBag,
      IconShoppingCart,
      IconTrash,
      IconX,
    }),
  ],
};
