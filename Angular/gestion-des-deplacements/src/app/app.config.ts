import { ApplicationConfig, Injectable, isDevMode, importProvidersFrom } from '@angular/core'; // <<< AJOUT importProvidersFrom
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { countryInterceptor } from './interceptors/country.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';

// Imports spécifiques pour angular-calendar
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, CalendarDateFormatter, CalendarModule } from 'angular-calendar'; // <<< AJOUT CalendarModule
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarNativeDateFormatter, DateFormatterParams } from 'angular-calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { registerLocaleData } from '@angular/common'; // IMPORT NÉCESSAIRE
import localeFr from '@angular/common/locales/fr'; // IMPORT DE LA LOCALE

registerLocaleData(localeFr); // ENREGISTREMENT DE LA LOCALE

// Classe de formatage pour les dates (sera fournie globalement)
@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return format(date, 'EEEE d', { locale: fr });
  }
  public override weekViewTitle({ date, locale }: DateFormatterParams): string {
    return format(date, 'MMM yyyy', { locale: fr });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, countryInterceptor])),
    provideAnimations(), // Nécessaire pour les animations du calendrier
    // NOUVEAU : Fournir le CalendarModule via importProvidersFrom
    importProvidersFrom(CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })),
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    },
  ]
};
