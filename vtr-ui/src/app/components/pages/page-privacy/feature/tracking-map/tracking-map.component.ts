import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { UserAllowService } from '../../common/services/user-allow.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { TrackingMapService } from './services/tracking-map.service';
import { SingleTrackersInfo, TrackersInfo, typeData } from './services/tracking-map.interface';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { AnalyticsService } from '../../common/services/analytics.service';
import { GetParentForAnalyticsService } from '../../common/services/get-parent-for-analytics.service';

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

	percentOfTrack = 0;
	readonly trackingMapSinglePopupId = 'trackingMapSingle';
	isUserData = false;
	trackingData$ = this.getTrackingData();
	isTrackersBlocked$ = this.trackingMapService.isTrackersBlocked$;
	defaultIcon = DEFAULT_ICON;

	tryProductText = {
		risk: 'Most websites collect your IP address, location, social profile information, ' +
			'and even shopping history to personalize your experience, show targeted ads, ' +
			'or suggest things based on your interests.',
		howToFix: 'You can block some tracking tools by turning on the ‘Do Not Track’ feature in your browser. ' +
			'Or install Lenovo Privacy by FigLeaf and block them ' +
			'completely from collecting your personal information.'
	};

	textForLoader = 'Creating tracker map for the most popular websitess';

	constructor(
		private trackingMapService: TrackingMapService,
		private commonPopupService: CommonPopupService,
		private userAllowService: UserAllowService,
		private analyticsService: AnalyticsService,
		private getParentForAnalyticsService: GetParentForAnalyticsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
	) {
	}

	ngOnInit() {
		this.listenPermit();
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

	private getPercentOfTrack(trackerData: SingleTrackersInfo, trackingsData: TrackersInfo) {
		return Math.round((trackerData.sites.length / Object.keys(trackingsData.sites).length) * 100);
	}

	private getTrackingData() {
		return this.trackingMapService.trackingData$.pipe(
			tap((val) => this.isUserData = val.typeData === typeData.Users),
			map((val) => val.trackingData)
		);
	}

	private listenPermit() {
		this.userAllowService.allowToShow.pipe(
			filter((value) => value.hasOwnProperty('trackingMap')),
			takeUntil(instanceDestroyed(this)),
		).subscribe(() => this.trackingMapService.updateTrackingData());
	}
}
