import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, take } from 'rxjs/operators';
import { ChoseBrowserService } from './chose-browser.service';
import { UserAllowService } from '../shared/services/user-allow.service';
import { HttpClient } from '@angular/common/http';
import { VantageCommunicationService, VisitedWebsitesInfo } from './vantage-communication.service';
import { topVisitedSites } from './tracking-map-top';
import {
	SingleTrackersInfo,
	TrackersInfo,
	TrackingData,
	TrackingDataDescription,
	TrackingDataSiteDescription,
	typeData
} from './tracking-map.interface';
import { returnUniqueElementsInArray } from '../shared/helpers';
import { FigleafOverviewService } from './figleaf-overview.service';

@Injectable({
	providedIn: 'root'
})
export class TrackingMapService {
	isTrackersBlocked$ = this.figleafOverviewService.figleafSettings$.asObservable()
		.pipe(
			map((settings) => settings.isAntitrackingEnabled),
			startWith(false)
		);

	private trackingData = new ReplaySubject<TrackingData>(1);
	trackingData$ = this.trackingData.asObservable();

	private getTrackingSingleData = new ReplaySubject<SingleTrackersInfo>(1);
	getTrackingSingleData$ = this.getTrackingSingleData.asObservable();

	private trackersCache$: Observable<TrackersInfo>;

	constructor(
		private choseBrowserService: ChoseBrowserService,
		private userAllowService: UserAllowService,
		private http: HttpClient,
		private vantageCommunicationService: VantageCommunicationService,
		private figleafOverviewService: FigleafOverviewService,
	) {
		this.updateTrackingData();
	}

	updateTrackingData() {
		this.getTrackingData().subscribe((val: any) => {
			this.trackingData.next(val);
		});
	}

	setNextSingleData(trackerData: SingleTrackersInfo) {
		this.getTrackingSingleData.next(trackerData);
	}

	private getTrackingData() {
		return this.downloadTrackersInfo().pipe(
			switchMap((trackersInfo) => {
					let sites = this.getTopWebsites();
					if (this.choseBrowserService.isBrowserChose() && this.userAllowService.allowToShow.trackingMap) {
						sites = this.getVisitedWebsites(this.choseBrowserService.getName());
					}

					return sites.pipe(map((userHistory) => ({trackersInfo, userHistory})));
				}
			),
			map(({trackersInfo, userHistory}) => ({
				typeData: userHistory.typeData,
				trackingData: this.convertToTrackingData(trackersInfo, userHistory.sites)
			})),
			take(1)
		);
	}

	private convertToTrackingData(trackersInfo: TrackersInfo, userHistory: VisitedWebsitesInfo[]): TrackingDataDescription {
		const sites = userHistory
			.filter((site) => site && trackersInfo.sites[site.domain])
			.map((site) => ({
				domain: site.domain,
				favicon_url: trackersInfo.sites[site.domain].icon,
				trackers: trackersInfo.sites[site.domain].trackers
			}));
		const trackers = sites
			.reduce((acc, val) => returnUniqueElementsInArray<TrackingDataSiteDescription>(acc.concat(val.trackers)), [])
			.reduce((acc, tracker) => ({...acc, [tracker]: trackersInfo.trackers[tracker]}), {});

		return {sites, trackers};
	}

	private getVisitedWebsites(browserName) {
		return this.vantageCommunicationService.getVisitedWebsites([browserName]).pipe(
			map((userHistory) => Object.values(userHistory).reduce((acc, val) => acc.concat(val), [])),
			map((userHistory) => ({typeData: typeData.Users, sites: userHistory}))
		);
	}

	private getTopWebsites() {
		return of({typeData: typeData.General, sites: topVisitedSites});
	}


	private downloadTrackersInfo() {
		if (!this.trackersCache$) {
			this.trackersCache$ = this.http.get<TrackersInfo>('/assets/privacy-json/trackers.json').pipe(
				shareReplay(1)
			);
		}
		return this.trackersCache$;
	}
}
