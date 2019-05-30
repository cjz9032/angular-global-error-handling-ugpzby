import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { BreachedAccountsService } from './breached-accounts.service';
import { UserDataGetStateService } from './user-data-get-state.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TaskActionService {

	constructor(
		private analyticsService: AnalyticsService,
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService,
		private userDataGetStateService: UserDataGetStateService,
	) {
		merge(
			this.breachedAccountsService.scanBreachesAction$.pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'BreachedAccountsScan',
						TaskResult: this.userDataGetStateService.getUserDataStatus().breachedAccountsResult,
					};
				})
			),
			this.browserAccountsService.getNonPrivateStoragesAction$.pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'NonPrivatePasswordsScan',
						TaskResult: this.userDataGetStateService.getUserDataStatus().nonPrivatePasswordResult,
					};
				})
			),
			this.trackingMapService.getTrackingDataAction$.pipe(
				map((value) => {
					return {
						...value,
						TaskName: 'WebsiteTrackersScan',
						TaskResult: this.userDataGetStateService.getUserDataStatus().websiteTrackersResult,
					};
				})
			),
		).subscribe((result) => {
			const taskActionData = {
				...result,
				TaskCount: 1,
			};
			this.analyticsService.sendTaskActionData(taskActionData);
		});
	}
}
