import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { map, tap } from 'rxjs/operators';
import { UserAllowService } from '../../common/services/user-allow.service';
import { TrackingMapService } from './services/tracking-map.service';
import { SingleTrackersInfo, TrackersInfo, typeData } from './services/tracking-map.interface';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { AnalyticsService } from '../../common/services/analytics.service';
import { GetParentForAnalyticsService } from '../../common/services/get-parent-for-analytics.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';

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
	isConsentGiven$ = this.userAllowService.allowToShow.pipe(map((value) => value['trackingMap']));
	websiteTrackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount;
	percentOfTrack = 0;
	readonly trackingMapSinglePopupId = 'trackingMapSingle';
	isUserData = false;
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

	textForLoader = 'Creating tracker map for the most popular websitess';

	constructor(
		private trackingMapService: TrackingMapService,
		private commonPopupService: CommonPopupService,
		private userAllowService: UserAllowService,
		private analyticsService: AnalyticsService,
		private getParentForAnalyticsService: GetParentForAnalyticsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private countNumberOfIssuesService: CountNumberOfIssuesService
	) {
	}

	ngOnInit() {
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

	sendAnalytics() {
		this.analyticsService.sendItemClickData({
			ItemName: 'WebsiteTrackersDetailItem',
			ItemParent: this.getParentForAnalyticsService.getPageName() + '.' + 'WebsiteTrackersBlock',
		});
	}

	giveConcent() {
		this.userAllowService.setShowTrackingMap(true);
	}

	private getPercentOfTrack(trackerData: SingleTrackersInfo, trackingsData: TrackersInfo) {
		return Math.round((trackerData.sites.length / Object.keys(trackingsData.sites).length) * 100);
	}

	private getTrackingData() {
		return this.trackingMapService.trackingData$.pipe(
			tap((val) => this.isUserData = val.typeData === typeData.Users),
			map((val) => val.trackingData)
		);
	}
}
