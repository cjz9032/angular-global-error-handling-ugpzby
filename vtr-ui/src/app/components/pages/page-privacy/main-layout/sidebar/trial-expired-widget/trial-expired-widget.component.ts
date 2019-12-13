import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { FigleafOverviewService } from '../../../core/services/figleaf-overview.service';
import { AppStatusesService } from '../../../core/services/app-statuses/app-statuses.service';
import { AppStatuses } from '../../../userDataStatuses';

@Component({
	selector: 'vtr-trial-expired-widget',
	templateUrl: './trial-expired-widget.component.html',
	styleUrls: ['./trial-expired-widget.component.scss']
})
export class TrialExpiredWidgetComponent {
	appStatuses = AppStatuses;

	isShow$ = this.appStatusesService.isAppStatusesEqual([
		AppStatuses.trialSoonExpired,
		AppStatuses.subscriptionSoonExpired,
		AppStatuses.trialExpired,
		AppStatuses.subscriptionExpired
	]);

	appStatuses$ = this.appStatusesService.globalStatus$.pipe(
		map((globalStatus) => globalStatus.appState)
	);

	timeToExpires$ = this.figleafOverviewService.figleafStatus$.pipe(
		map((res) => res.daysToExpiration)
	);

	constructor(
		private appStatusesService: AppStatusesService,
		private figleafOverviewService: FigleafOverviewService
	) {	}
}
