import { Component, Input, OnInit } from '@angular/core';
import { TrackingMapService } from '../../common-services/tracking-map.service';

@Component({
	selector: 'vtr-single-tracker-detail',
	templateUrl: './single-tracker-detail.component.html',
	styleUrls: ['./single-tracker-detail.component.scss']
})
export class SingleTrackerDetailComponent implements OnInit {
	@Input() percentOfTrack = 0;
	trackingMapSingleData$ = this.trackingMapService.getTrackingSingleData$;
	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;

	constructor(private trackingMapService: TrackingMapService) {
	}

	ngOnInit() {
	}

}
