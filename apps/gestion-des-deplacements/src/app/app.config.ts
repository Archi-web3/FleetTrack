import { ApplicationConfig, Injectable, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { countryInterceptor } from './core/interceptors/country.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './core/services/custom-paginator-intl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, CalendarDateFormatter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarNativeDateFormatter, DateFormatterParams } from 'angular-calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

registerLocaleData(localeFr);
registerLocaleData(localeEs);
registerLocaleData(localeEn);

// Factory i18n — API ngx-translate v16 (compatible Angular 20)
// deps: [HttpClient] => Angular injecte HttpClient dans le bon contexte
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

// Formatage des dates du calendrier
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
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),

    // i18n — ngx-translate v16 + Angular 20
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    ),

    // Angular Calendar
    importProvidersFrom(CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })),
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
};
