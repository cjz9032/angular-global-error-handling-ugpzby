import { Component, Input, OnInit } from '@angular/core';
import { TrackingMapService } from '../../common-services/tracking-map.service';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';

@Component({
	selector: 'vtr-tracking-map',
	templateUrl: './tracking-map.component.html',
	styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements OnInit {
	@Input() animate = false;
	percentOfTrack = 0;
	trackingMapSinglePopupId = 'trackingMapSingle';
	trackingData$ = this.trackingMapService.getTrackingData$;
	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;

	constructor(
		private trackingMapService: TrackingMapService,
		private commonPopupService: CommonPopupService,
	) {
	}

	ngOnInit() {
	}

	showDetails(trackerData, trackingsData) {
		this.percentOfTrack = this.getPercentOfTrack(trackerData, trackingsData);
		this.trackingMapService.setNextSingleData(trackerData);
		this.commonPopupService.open(this.trackingMapSinglePopupId);
	}

	private getPercentOfTrack(trackerData: any, trackingsData: any) {
		return Math.round((trackerData.sites.length / trackingsData.sites.length) * 100);
	}

}
