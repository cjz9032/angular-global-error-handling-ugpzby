import { Component, Input, OnInit } from '@angular/core';
import { TrackingMapService } from '../services/tracking-map.service';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { DEFAULT_ICON } from '../tracking-map.component';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Component({
	selector: 'vtr-single-tracker-detail',
	templateUrl: './single-tracker-detail.component.html',
	styleUrls: ['./single-tracker-detail.component.scss']
})
export class SingleTrackerDetailComponent implements OnInit {
	@Input() percentOfTrack = 0;
	@Input() popUpId: string;
	@Input() isFigleafInExit: boolean;
	trackingMapSingleData$ = this.trackingMapService.getTrackingSingleData$;
	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	defaultIcon = DEFAULT_ICON;

	constructor(
		private trackingMapService: TrackingMapService,
		private commonPopupService: CommonPopupService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
	}

	ngOnInit() {
	}

	getColorForTrackerTypes(trackingTypeName) {
		return {
			'tracker__types-item--orange': trackingTypeName.toLowerCase() === 'advertising',
			'tracker__types-item--blue': trackingTypeName.toLowerCase() === 'social',
			'tracker__types-item--pink': trackingTypeName.toLowerCase() === 'analytics',
		};
	}

	closePopup() {
		this.commonPopupService.close(this.popUpId);
	}

}
