import { Component } from '@angular/core';
import { UserDataStateService } from '../../../common/services/app-statuses/user-data-state.service';
import { map } from 'rxjs/operators';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';
import { DifferenceInDays } from '../../../utils/helpers';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';

@Component({
	selector: 'vtr-trial-expired-widget',
	templateUrl: './trial-expired-widget.component.html',
	styleUrls: ['./trial-expired-widget.component.scss']
})
export class TrialExpiredWidgetComponent {
	isFigleafTrialSoonExpired$ = this.appStatusesService.isFigleafSoonExpired$;
	isFigleafTrialExpired$ = this.appStatusesService.isFigleafExpired$;

	timeToExpires$ = this.figleafOverviewService.figleafStatus$.pipe(
		map((res) => DifferenceInDays((Date.now()), res.expirationDate * 1000))
	);

	constructor(
		private appStatusesService: AppStatusesService,
		private figleafOverviewService: FigleafOverviewService
	) {	}
}
