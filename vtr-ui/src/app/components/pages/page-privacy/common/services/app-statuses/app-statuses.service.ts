import { Injectable } from '@angular/core';
import { GlobalAppStatusService } from './global-app-status.service';
import { UserDataStateService } from './user-data-state.service';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';

export interface GlobalStatuses {
	appState: AppStatuses;
	breachedAccountsResult: FeaturesStatuses;
	websiteTrackersResult: FeaturesStatuses;
	nonPrivatePasswordResult: FeaturesStatuses;
}

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

	isFigleafSoonExpired$ = this.isAppStatusesEqual([AppStatuses.trialSoonExpired, AppStatuses.subscriptionSoonExpired]);
	isFigleafExpired$ = this.isAppStatusesEqual([AppStatuses.trialExpired, AppStatuses.subscriptionExpired]);

	isFigleafInstalled$ = this.isAppStatusesEqual([AppStatuses.figLeafInstalled]);

	constructor(
		private globalAppStatusService: GlobalAppStatusService,
		private userDataGetStateService: UserDataStateService
	) {
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

	private isAppStatusesEqual(appStatus: AppStatuses[]) {
		return this.globalStatus$.pipe(
			map((userDataStatus) => appStatus.includes(userDataStatus.appState))
		);
	}
}
