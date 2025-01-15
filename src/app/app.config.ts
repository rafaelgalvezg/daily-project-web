import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {environment} from '../environments/environment.development';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {ServerErrorInterceptor} from './core/interceptor/server-error.interceptor';

export function tokenGetter() {
  //return localStorage.getItem("access_token");
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

export const appConfig: ApplicationConfig = {

  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    //provideHttpClient()

    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:9090"],
          disallowedRoutes: [
            "http://localhost:9090/daily-project/login",
            "http://localhost:9090/daily-project/login/forget"
          ]

        },
      }),
    ),
    provideHttpClient(
      withInterceptorsFromDi() // For petitions with JWT
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    }
  ]
};
