import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';


registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),
    provideEnvironmentNgxMask(
      {
        maskAliases: {
          TEL: '(00) 0000-0000||(00) 00000-0000',
          CEP: '00000-000'
        }
      }
    ),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
};
