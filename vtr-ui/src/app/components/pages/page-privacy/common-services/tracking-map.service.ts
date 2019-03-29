import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { mapData } from '../pages/trackers/map-data';
import { delay, filter, map, startWith } from 'rxjs/operators';
import { ChoseBrowserService } from './chose-browser.service';
import { UserAllowService } from '../shared/services/user-allow.service';

export const enum typeData {
	General = 'general',
	Users = 'users',
}

export interface TrackingData {
	typeData: typeData;
	trackingData: typeof mapData;
}

@Injectable({
	providedIn: 'root'
})
export class TrackingMapService {
	private isTrackersBlocked = new Subject<boolean>();
	isTrackersBlocked$ = this.isTrackersBlocked.asObservable().pipe(startWith(false));

	private generalTrackingData = new ReplaySubject<typeof mapData>(1);
	generalTrackingData$: Observable<TrackingData> = this.generalTrackingData.asObservable()
		.pipe(
			filter(() => !this.choseBrowserService.isBrowserChose() || !this.userAllowService.allowToShow.trackingMap),
			map((trackingData) => ({typeData: typeData.General, trackingData}))
		);

	private usersTrackingData = new ReplaySubject<typeof mapData>(1);
	usersTrackingData$: Observable<TrackingData> = this.usersTrackingData.asObservable()
		.pipe(
			filter(() => this.choseBrowserService.isBrowserChose() && this.userAllowService.allowToShow.trackingMap),
			map((trackingData) => ({typeData: typeData.Users, trackingData}))
		);

	private getTrackingSingleData = new ReplaySubject(1);
	getTrackingSingleData$ = this.getTrackingSingleData.asObservable();

	constructor(
		private choseBrowserService: ChoseBrowserService,
		private userAllowService: UserAllowService
	) {
		this.updateTrackingData();
	}

	updateTrackingData() {
		of(mapData).pipe(delay(1000)).subscribe((val) => {
			this.generalTrackingData.next(val);
			this.usersTrackingData.next(val);
		});
	}

	setNextSingleData(trackerData) {
		this.getTrackingSingleData.next(trackerData);
	}
}
