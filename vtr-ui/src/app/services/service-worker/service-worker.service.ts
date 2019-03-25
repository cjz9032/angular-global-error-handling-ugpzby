import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

@Injectable({
	providedIn: 'root'
})
export class ServiceWorkerService {

	constructor(
		appRef: ApplicationRef
		, updates: SwUpdate
		, commonService: CommonService) {
		// Allow the app to stabilize first, before starting polling for updates with `interval()`.
		const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
		const updateCheckInterval$ = interval(60 * 1000);
		const onceAppIsStable$ = concat(appIsStable$, updateCheckInterval$);
		onceAppIsStable$.subscribe(() => updates.checkForUpdate());

		// check for update available, if available then reload
		updates.available.subscribe(event => {
			console.log('sw updates.available', event);
			// if (promptUser(event)) {
			// updates.activateUpdate().then(() => document.location.reload());
			// }
		});

		window.addEventListener('online', (e) => {
			console.log('online', e);
			commonService.sendNotification(NetworkStatus.Online, { isOnline: navigator.onLine });
		}, false);

		window.addEventListener('offline', (e) => {
			console.log('offline', e);
			commonService.sendNotification(NetworkStatus.Offline, { isOnline: navigator.onLine });
		}, false);
	}
}

