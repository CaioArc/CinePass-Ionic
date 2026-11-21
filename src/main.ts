import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(AppComponent, { providers: [provideIonicAngular(), provideRouter(routes), provideHttpClient(), { provide: LOCALE_ID, useValue: 'pt-BR' }] }).catch((error: unknown) => console.error(error));
