import { Component, OnInit } from '@angular/core';
import {
	TIME_TO_SHOW_EXPIRED_PITCH_MS,
	UserDataGetStateService
} from '../../../common/services/user-data-get-state.service';
import { map } from 'rxjs/operators';
import { AppStatuses } from '../../../userDataStatuses';
import { TrialExpiredWidgetService } from './trial-expired-widget.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

@Component({
	selector: 'vtr-trial-expired-widget',
	templateUrl: './trial-expired-widget.component.html',
	styleUrls: ['./trial-expired-widget.component.scss']
})
export class TrialExpiredWidgetComponent implements OnInit {
	timeToExpires = TIME_TO_SHOW_EXPIRED_PITCH_MS / MS_IN_DAY;
	isFigleafTrialSoonExpired$ = this.isAppStatusesEqual(AppStatuses.trialSoonExpired);
	isFigleafTrialExpired$ = this.isAppStatusesEqual(AppStatuses.trialExpired);

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private trialExpiredWidgetService: TrialExpiredWidgetService,
		private vantageCommunicationService: VantageCommunicationService
	) {	}

	ngOnInit() {
	}

	goToSeePlans() {
		this.trialExpiredWidgetService.getLinkForSeePlans().subscribe((response) => {
			this.vantageCommunicationService.openUri(response.seePlansLink);
		});
	}

	private isAppStatusesEqual(appStatus: AppStatuses) {
		return this.userDataGetStateService.userDataStatus$.pipe(
			map((userDataStatus) => userDataStatus.appState === appStatus)
		);
	}
}
