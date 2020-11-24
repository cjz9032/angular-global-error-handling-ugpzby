import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { Battery, BatteryHealthResponse } from './battery-health.interface';
import { from, Observable, Subject, timer } from 'rxjs';
import { publishLast, shareReplay, skipWhile, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

const CACHE_SIZE = 1;

@Injectable({
	providedIn: 'root'
})
export class BatteryHealthService {
	private batteryFeature: Battery;
	private cache$: Observable<BatteryHealthResponse>;
	private reload$ = new Subject();

	constructor(
		private shellService: VantageShellService,
		private localCacheService: LocalCacheService
	) {
		this.batteryFeature = this.shellService.getSmartBatteryInfo();
	}

	get batteryInfo(): Observable<BatteryHealthResponse> {
		if (!this.cache$) {
			// @ts-ignore
			// As far as we know, the common method 'getLocalStorageValue' doesn't provide generics types. we can't transform types back.
			// then we leave ignore here.
			this.cache$ = timer(0, 30000).pipe(
				switchMap(() => this.requestBatteryInfo()),
				takeUntil(this.reload$),
				shareReplay(CACHE_SIZE),
				startWith((this.localCacheService.getLocalCacheValue(LocalStorageKey.BatteryHealth, undefined) as object | undefined) || {}),
			);
		}
		return this.cache$;
	}

	requestBatteryInfo(): Observable<BatteryHealthResponse> {
		return from(this.batteryFeature.getSmartBatteryInfo())
			.pipe(
				skipWhile((value) => !value),
				tap(response => this.localCacheService.setLocalCacheValue(LocalStorageKey.BatteryHealth, response)))
	}

	clearMemoryCache() {
		this.reload$.next();
		this.cache$ = null;
	}

}
