import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TrackingMapService, typeData } from '../../common-services/tracking-map.service';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ChoseBrowserService } from '../../common-services/chose-browser.service';
import { FormControl } from '@angular/forms';
import { UserAllowService } from '../../shared/services/user-allow.service';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-tracking-map',
	templateUrl: './tracking-map.component.html',
	styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements OnInit, OnDestroy {
	@Input() animate = false;

	trackingControl = new FormControl(this.userAllowService.allowToShow.trackingMap);

	percentOfTrack = 0;
	readonly trackingMapSinglePopupId = 'trackingMapSingle';

	isUserData = false;
	choseBrowserName = this.choseBrowserService.getName();

	trackingData$ = this.getTrackingData();

	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;

	constructor(
		private trackingMapService: TrackingMapService,
		private commonPopupService: CommonPopupService,
		private choseBrowserService: ChoseBrowserService,
		private userAllowService: UserAllowService,
	) {
	}

	ngOnInit() {
		this.listenTrackingControl();
	}

	ngOnDestroy() {
	}

	getText() {
		return {
			chartLabel: this.isUserData ? 'Websites you visit' : 'The most popular websites',
			cloudLabel: this.isUserData ? 'Companies that track you' : 'Companies who\'s track websites',
		};
	}

	showDetails(trackerData, trackingsData) {
		this.percentOfTrack = this.getPercentOfTrack(trackerData, trackingsData);
		this.trackingMapService.setNextSingleData(trackerData);
		this.commonPopupService.open(this.trackingMapSinglePopupId);
	}

	isShowToggle() {
		return this.choseBrowserService.isBrowserChose();
	}

	private getPercentOfTrack(trackerData: any, trackingsData: any) {
		return Math.round((trackerData.sites.length / trackingsData.sites.length) * 100);
	}

	private listenTrackingControl() {
		this.trackingControl.valueChanges.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe((val) => {
			this.userAllowService.setShowTrackingMap(val);
			this.trackingMapService.updateTrackingData();
		});
	}

	private getTrackingData() {
		return merge(
			this.trackingMapService.generalTrackingData$,
			this.trackingMapService.usersTrackingData$,
		).pipe(
			tap((val) => console.log(val)),
			tap((val) => this.isUserData = val.typeData === typeData.Users),
			map((val) => val.trackingData)
		);
	}
}
