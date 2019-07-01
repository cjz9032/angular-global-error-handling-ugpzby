import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TIME_TO_SHOW_EXPIRED_PITCH_MS } from '../../services/user-data-get-state.service';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

@Component({
	selector: 'vtr-big-pitch',
	templateUrl: './big-pitch.component.html',
	styleUrls: ['./big-pitch.component.scss']
})
export class BigPitchComponent {
	@Input() texts = {
		title: 'The choice to be private is here',
		text: 'Get the app that lets you decide when to share and when to be private, wherever you go online. ' +
			'Trial duration 14-day. No credit card required.'
	};
	@Input() isFigleafTrialSoonExpired = false;
	@Input() isFigleafTrialExpired = false;
	@Output() clickMore = new EventEmitter();

	timeToExpires = TIME_TO_SHOW_EXPIRED_PITCH_MS / MS_IN_DAY;
}
