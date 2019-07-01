import { Component } from '@angular/core';
import {
	TIME_TO_SHOW_EXPIRED_PITCH_MS,
	UserDataGetStateService
} from '../../../common/services/user-data-get-state.service';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

@Component({
	selector: 'vtr-trial-expired-widget',
	templateUrl: './trial-expired-widget.component.html',
	styleUrls: ['./trial-expired-widget.component.scss']
})
export class TrialExpiredWidgetComponent {
	timeToExpires = TIME_TO_SHOW_EXPIRED_PITCH_MS / MS_IN_DAY;
	isFigleafTrialSoonExpired$ = this.userDataGetStateService.isFigleafTrialSoonExpired$;
	isFigleafTrialExpired$ = this.userDataGetStateService.isFigleafTrialExpired$;

	constructor(
		private userDataGetStateService: UserDataGetStateService,
	) {	}
}
