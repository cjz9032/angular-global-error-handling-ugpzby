import { Component } from '@angular/core';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { map } from 'rxjs/operators';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';
import { DifferenceInDays } from '../../../utils/helpers';

@Component({
	selector: 'vtr-trial-expired-widget',
	templateUrl: './trial-expired-widget.component.html',
	styleUrls: ['./trial-expired-widget.component.scss']
})
export class TrialExpiredWidgetComponent {
	isFigleafTrialSoonExpired$ = this.userDataGetStateService.isFigleafTrialSoonExpired$;
	isFigleafTrialExpired$ = this.userDataGetStateService.isFigleafTrialExpired$;

	timeToExpires$ = this.figleafOverviewService.figleafStatus$.pipe(
		map((res) => DifferenceInDays((Date.now()), res.expirationDate * 1000))
	);

	constructor(
		private userDataGetStateService: UserDataGetStateService,
		private figleafOverviewService: FigleafOverviewService
	) {	}
}
