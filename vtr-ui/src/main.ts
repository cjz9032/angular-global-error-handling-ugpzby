import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppModule } from './app/modules/app.module';

if (environment.production) {
	enableProdMode();
}

if (environment.fullStory) {
	const script = document.createElement('script');
	script.src = './scripts/fullstory.js';
	script.type = 'application/javascript';
	document.head.appendChild(script);
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => {});
