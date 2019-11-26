import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppStatuses } from '../../../userDataStatuses';

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
	@Input() isShowExpiredPitch = false;
	@Input() appStatuses: AppStatuses;
	@Input() timeToExpires;
	@Input() articleId: number;
	@Input() isLanding = false;
	@Input() isTrackerPitch = false;
	@Input() isFigleafInExit = false;
	@Output() clickMore = new EventEmitter();

	isFigleafInExitTexts = {
		title: 'Can’t sync your information',
		text: 'To see the most recent information about breaches and tracking tools, launch Lenovo Privacy Essentials by FigLeaf.'
	};

	appStatusesEnum = AppStatuses;
}
