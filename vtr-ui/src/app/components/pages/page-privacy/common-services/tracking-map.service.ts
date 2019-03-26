import { Injectable, OnInit } from '@angular/core';
import { of, ReplaySubject, Subject } from 'rxjs';
import { mapData } from '../pages/trackers/map-data';
import { delay, filter, startWith } from 'rxjs/operators';
import { ChoseBrowserService } from './chose-browser.service';

@Injectable({
	providedIn: 'root'
})
export class TrackingMapService {
	private isTrackersBlocked = new Subject<boolean>();
	isTrackersBlocked$ = this.isTrackersBlocked.asObservable().pipe(startWith(false));

	private trackingData = new ReplaySubject<typeof mapData>(1);
	getTrackingData$ = this.trackingData.asObservable()
		.pipe(filter(() => this.choseBrowserService.isBrowserChose()));

	private getTrackingSingleData = new ReplaySubject(1);
	getTrackingSingleData$ = this.getTrackingSingleData.asObservable();

	constructor(private choseBrowserService: ChoseBrowserService) {
		of(mapData).pipe(delay(1000)).subscribe((val) => this.trackingData.next(val));
	}

	setNextSingleData(trackerData) {
		this.getTrackingSingleData.next(trackerData);
	}
}
