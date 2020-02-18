import { Inject, Injectable } from '@angular/core';
import { EMPTY, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, take } from 'rxjs/operators';
import { UserAllowService } from '../../../core/services/user-allow.service';
import { HttpClient } from '@angular/common/http';
import {
	VantageCommunicationService,
	VisitedWebsitesInfo
} from '../../../core/services/vantage-communication.service';
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
import { FigleafOverviewService } from '../../../core/services/figleaf-overview.service';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../../core/services/analytics/task-action-with-timeout.service';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';

@Injectable({
	providedIn: 'root'
})
export class TrackingMapService {
	isTrackersBlocked$ = this.figleafOverviewService.figleafSettings$
		.pipe(
			map((settings) => settings.isAntitrackingEnabled),
			startWith(false),
			catchError((err) => of(false))
		);

	private trackingData = new ReplaySubject<TrackingData>(1);
	trackingData$ = this.trackingData.asObservable();

	private update$ = new Subject();

	private getTrackingSingleData = new ReplaySubject<SingleTrackersInfo>(1);
	getTrackingSingleData$ = this.getTrackingSingleData.asObservable();

	private trackersCache$: Observable<TrackersInfo>;

	constructor(
		private userAllowService: UserAllowService,
		private http: HttpClient,
		private vantageCommunicationService: VantageCommunicationService,
		private figleafOverviewService: FigleafOverviewService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {
		this.updateTrackingData();

		merge(
			this.userAllowService.allowToShow,
			this.figleafOverviewService.figleafSettings$,
			this.update$.asObservable()
		).subscribe(() => {
			this.updateTrackingData();
		});
	}

	update() {
		this.update$.next(true);
	}

	private updateTrackingData() {
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
				favicon_url: this.environment.staticUrl + trackersInfo.sites[site.domain].icon,
				trackers: trackersInfo.sites[site.domain].trackers
			}));

		const trackers = sites
			.reduce((acc, val) => returnUniqueElementsInArray<TrackingDataSiteDescription>(acc.concat(val.trackers)), [])
			.reduce((acc, tracker) => ({
				...acc, [tracker]: {
					...trackersInfo.trackers[tracker],
					logo_url: this.environment.staticUrl + trackersInfo.trackers[tracker].logo_url,
				}
			}), {});

		return {sites, trackers};
	}

	private getVisitedWebsites() {
		return this.vantageCommunicationService.getVisitedWebsites()
			.pipe(
				map((userHistory) => userHistory.visitedWebsites),
				map((userHistory) => ({typeData: typeData.Users, sites: userHistory})),
				catchError((err) => {
                    this.trackingData.next({
						typeData: typeData.Users,
						trackingData: {sites: [], trackers: {}},
						error: err
					});
                    this.sendTaskAction();
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
		this.taskActionWithTimeoutService.finishedAction(TasksName.getTrackingDataAction);
	}

}
