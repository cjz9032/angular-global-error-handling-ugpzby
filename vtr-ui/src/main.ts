import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { HardwareDashboardModule } from './app/modules/hardware-dashboard.module';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(HardwareDashboardModule)
	.catch(err => console.error(err));
