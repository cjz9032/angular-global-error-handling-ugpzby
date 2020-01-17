import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { Backlight, BacklightLevel, BacklightMode, BacklightStatus } from './backlight.interface';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
	providedIn: 'root'
})
export class BacklightService {
	private backlightFeature: Backlight;
	private cache$: Observable<Array<BacklightStatus | BacklightLevel>>;
	private reload$ = new Subject();

	constructor(
		private shellService: VantageShellService
	) {
		this.backlightFeature = this.shellService.getBacklight();
	}

	get backlight(): Observable<Array<BacklightStatus | BacklightLevel>> {
		if (!this.cache$) {
			this.cache$ = this.requestBacklight().pipe(
				takeUntil(this.reload$),
				shareReplay(CACHE_SIZE)
			);
		}
		return this.cache$;
	}

	requestBacklight(): Observable<Array<BacklightStatus | BacklightLevel>> {
		return from(this.backlightFeature.getBacklight())
			.pipe(
				map(res => res.settingList.setting)
			);
	}

	forceReload() {
		this.reload$.next();
		this.cache$ = null;
	}

	setBacklight(mode: BacklightMode) {
		return from(this.backlightFeature.setBacklight({
			settingList: {
				setting: [
					{
						key: 'KeyboardBacklightStatus',
						value: mode.value
					}
				]
			}
		}));
	}
}
