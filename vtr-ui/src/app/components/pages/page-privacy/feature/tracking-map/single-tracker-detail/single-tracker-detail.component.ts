import { Component, Input } from '@angular/core';
import { DEFAULT_ICON } from '../tracking-map.component';
import { SingleTrackersInfo } from '../services/tracking-map.interface';

@Component({
	selector: 'vtr-single-tracker-detail',
	templateUrl: './single-tracker-detail.component.html',
	styleUrls: ['./single-tracker-detail.component.scss']
})
export class SingleTrackerDetailComponent {
	@Input() percentOfTrack = 0;
	@Input() popUpId: string;
	@Input() trackingMapSingleData: SingleTrackersInfo;
	@Input() isTrackersBlocked: boolean;
	@Input() isFigleafReadyForCommunication: boolean;
	@Input() isFigleafInExit: boolean;

	defaultIcon = DEFAULT_ICON;

	getText() {
		return {
			title: 'Choose to block tracking tools completely',
			text: 'Lenovo Privacy Essentials lets you visit your favorite websites without sharing your private information.'
		};
	}
}
