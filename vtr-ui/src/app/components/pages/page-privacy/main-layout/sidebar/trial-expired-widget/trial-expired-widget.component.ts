import { Component } from '@angular/core';
import { UserDataStateService } from '../../../common/services/app-statuses/user-data-state.service';
import { map } from 'rxjs/operators';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';
import { DifferenceInDays } from '../../../utils/helpers';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';
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
		map((res) => DifferenceInDays((Date.now()), res.expirationDate * 1000) || 1)
	);

	constructor(
		private appStatusesService: AppStatusesService,
		private figleafOverviewService: FigleafOverviewService
	) {	}
}
