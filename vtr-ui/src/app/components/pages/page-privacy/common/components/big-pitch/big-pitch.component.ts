import { Component, EventEmitter, Input, Output } from '@angular/core';

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
	@Input() timeToExpires;
	@Input() articleId: number;
	@Output() clickMore = new EventEmitter();
}
