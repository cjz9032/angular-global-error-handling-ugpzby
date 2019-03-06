import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ServiceWorkerService {

	constructor(appRef: ApplicationRef, updates: SwUpdate) {
		// Allow the app to stabilize first, before starting polling for updates with `interval()`.
		const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
		const everySixHours$ = interval(6 * 60 * 60 * 1000);
		const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
		everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

		// check for update available, if available then reload
		updates.available.subscribe(event => {
			// if (promptUser(event)) {
			updates.activateUpdate().then(() => document.location.reload());
			// }
		});
	}
}

