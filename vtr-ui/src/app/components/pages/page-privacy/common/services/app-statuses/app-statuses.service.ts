import { Injectable } from '@angular/core';
import { GlobalAppStatusService } from './global-app-status.service';
import { UserDataStateService } from './user-data-state.service';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';

export enum featuresResult {
	breachedAccountsResult = 'breachedAccountsResult',
	websiteTrackersResult = 'websiteTrackersResult',
	nonPrivatePasswordResult = 'nonPrivatePasswordResult'
}

export type GlobalStatuses = {appState: AppStatuses} & {[feature in featuresResult]: FeaturesStatuses};

@Injectable({
	providedIn: 'root'
})

export class AppStatusesService {
	private globalStatus = new ReplaySubject<GlobalStatuses>();
	globalStatus$ = this.globalStatus.asObservable().pipe(
		debounceTime(100),
		distinctUntilChanged(),
		shareReplay(1)
	);

	constructor(
		private globalAppStatusService: GlobalAppStatusService,
		private userDataGetStateService: UserDataStateService
	) {
		this.updateGlobalStatus();
		this.userDataGetStateService.updateData$.subscribe((val) => {
			this.updateGlobalStatus();
		});
	}

	getGlobalStatus() {
		return {
			appState: this.globalAppStatusService.getGlobalAppStatus(),
			...this.userDataGetStateService.getFeatureStatus()
		};
	}

	private updateGlobalStatus() {
		this.globalStatus.next(this.getGlobalStatus());
	}

	isAppStatusesEqual(appStatus: AppStatuses[]) {
		return this.globalStatus$.pipe(
			map((userDataStatus) => appStatus.includes(userDataStatus.appState))
		);
	}
}
