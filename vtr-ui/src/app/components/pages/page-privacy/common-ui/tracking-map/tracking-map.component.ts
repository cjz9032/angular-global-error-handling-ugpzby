import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ChoseBrowserService } from '../../common-services/chose-browser.service';
import { FormControl } from '@angular/forms';
import { UserAllowService } from '../../shared/services/user-allow.service';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { TrackingMapService } from '../../common-services/tracking-map.service';
import { SingleTrackersInfo, TrackersInfo, typeData } from '../../common-services/tracking-map.interface';
import { CommunicationWithFigleafService } from '../../communication-with-figleaf/communication-with-figleaf.service';

export const DEFAULT_ICON = {
	site: '/assets/images/privacy-tab/Website_Standart.png',
	tracker: '/assets/images/privacy-tab/Tracker_standart_big.png',
};

@Component({
	selector: 'vtr-tracking-map',
	templateUrl: './tracking-map.component.html',
	styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements OnInit, OnDestroy {
	@Input() animate = false;
	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	trackingControl = new FormControl(this.userAllowService.allowToShow.trackingMap);

	percentOfTrack = 0;
	readonly trackingMapSinglePopupId = 'trackingMapSingle';

	isUserData = false;
	choseBrowserName = this.choseBrowserService.getName();

	trackingData$ = this.getTrackingData();

	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;

	defaultIcon = DEFAULT_ICON;

	tryProductText = {
		title: 'Block online trackers with lenovo privacy by figleaf',
		text: 'Do what you love online without being tracked by advertisers and others. Start your 14-day free trial. No credit card required.',
		buttonText: 'Try Lenovo Privacy',
		link: {
			text: 'Learn more',
			url: '/#/privacy/landing'
		},

	};

	constructor(
		private trackingMapService: TrackingMapService,
		private commonPopupService: CommonPopupService,
		private choseBrowserService: ChoseBrowserService,
		private userAllowService: UserAllowService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
	) {}

	ngOnInit() {
		this.listenTrackingControl();
	}

	ngOnDestroy() {
	}

	getText() {
		return {
			chartLabel: this.isUserData ? 'Companies that track you' : 'Companies who\'s track websites',
			cloudLabel: this.isUserData ? 'Websites you visit' : 'The most popular websites',
		};
	}

	showDetails(trackerData: SingleTrackersInfo, trackingsData: TrackersInfo) {
		this.percentOfTrack = this.getPercentOfTrack(trackerData, trackingsData);
		this.trackingMapService.setNextSingleData(trackerData);
		this.commonPopupService.open(this.trackingMapSinglePopupId);
	}

	isShowToggle() {
		return this.choseBrowserService.isBrowserChose();
	}

	private getPercentOfTrack(trackerData: SingleTrackersInfo, trackingsData: TrackersInfo) {
		return Math.round((trackerData.sites.length / Object.keys(trackingsData.sites).length) * 100);
	}

	private listenTrackingControl() {
		this.trackingControl.valueChanges.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe((val) => {
			this.userAllowService.setShowTrackingMap(val);
			this.trackingMapService.updateTrackingData();
		});
	}

	tryProductBlockButtonClick(event) {
	}

	private getTrackingData() {
		return this.trackingMapService.trackingData$.pipe(
			tap((val) => this.isUserData = val.typeData === typeData.Users),
			map((val) => val.trackingData)
		);
	}
}
