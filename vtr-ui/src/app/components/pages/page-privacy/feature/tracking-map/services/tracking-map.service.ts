import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, take } from 'rxjs/operators';
import { ChoseBrowserService } from '../../../common/services/chose-browser.service';
import { UserAllowService } from '../../../common/services/user-allow.service';
import { HttpClient } from '@angular/common/http';
import {
	VantageCommunicationService,
	VisitedWebsitesInfo
} from '../../../common/services/vantage-communication.service';
import { topVisitedSites } from './tracking-map-top';
import {
	SingleTrackersInfo,
	TrackersInfo,
	TrackingData,
	TrackingDataDescription,
	TrackingDataSiteDescription,
	typeData
} from './tracking-map.interface';
import { returnUniqueElementsInArray } from '../../../utils/helpers';
import { FigleafOverviewService } from '../../../common/services/figleaf-overview.service';

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

	taskStartedTime = 0;
	getTrackingDataAction$ = new Subject<{ TaskDuration: number }>();

	private trackersCache$: Observable<TrackersInfo>;

	constructor(
		private choseBrowserService: ChoseBrowserService,
		private userAllowService: UserAllowService,
		private http: HttpClient,
		private vantageCommunicationService: VantageCommunicationService,
		private figleafOverviewService: FigleafOverviewService,
	) {
		this.updateTrackingData();
		this.userAllowService.allowToShow.subscribe(() => {
			this.updateTrackingData();
		});
	}

	updateTrackingData() {
		this.getTrackingData().subscribe((val) => {
			this.trackingData.next(val);
			if (val.typeData === typeData.Users) {
				this.sendTaskAction();
			}
		});
	}

	setNextSingleData(trackerData: SingleTrackersInfo) {
		this.getTrackingSingleData.next(trackerData);
	}

	private getTrackingData() {
		this.taskStartedTime = Date.now();
		return this.downloadTrackersInfo().pipe(
			switchMap((trackersInfo) => {
					const isAllowScanHistory = this.userAllowService.allowToShow.getValue().trackingMap;
					const sites = isAllowScanHistory ? this.getVisitedWebsites() : this.getTopWebsites();
					return sites.pipe(map((userHistory) => ({trackersInfo, userHistory})));
				}
			),
			map(({trackersInfo, userHistory}) => ({
				typeData: userHistory.typeData,
				trackingData: this.convertToTrackingData(trackersInfo, userHistory.sites),
				error: null,
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

	private getVisitedWebsites() {
		return this.vantageCommunicationService.getVisitedWebsites()
			.pipe(
				map((userHistory) => userHistory.visitedWebsites),
				map((userHistory) => ({typeData: typeData.Users, sites: userHistory})),
				catchError((err) => {
					this.trackingData.next({typeData: typeData.Users, trackingData: {sites: [], trackers: {}}, error: err});
					this.sendTaskAction();
					console.error('VisitedWebsites err', err);
					return EMPTY;
				}),
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

	private sendTaskAction() {
		const taskDuration = (Date.now() - this.taskStartedTime) / 1000;
		this.getTrackingDataAction$.next({TaskDuration: taskDuration});
	}

}
