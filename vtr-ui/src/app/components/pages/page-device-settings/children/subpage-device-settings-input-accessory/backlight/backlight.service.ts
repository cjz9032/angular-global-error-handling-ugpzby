import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Backlight, BacklightLevel, BacklightMode, BacklightStatus } from './backlight.interface';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
	providedIn: 'root'
})
export class BacklightService {
	private backlightFeature: Backlight;
	private backlight$: Observable<Array<BacklightStatus | BacklightLevel>>;

	constructor(
		private shellService: VantageShellService
	) {
		this.backlightFeature = this.shellService.getBacklight();
	}

	get backlight(): Observable<Array<BacklightStatus | BacklightLevel>> {
		if (!this.backlight$) {
			this.backlight$ = this.requestBacklight().pipe(
				shareReplay(CACHE_SIZE)
			);
		}
		return this.backlight$;
	}

	requestBacklight(): Observable<Array<BacklightStatus | BacklightLevel>> {
		return from(this.backlightFeature.getBacklight())
			.pipe(
				map(res => res.settingList.setting)
			);
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
