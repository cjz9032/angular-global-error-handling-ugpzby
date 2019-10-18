import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpsUpgrader } from './https-upgrader';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpsUpgrader, multi: true },
];
