import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { Backlight, BacklightLevel, BacklightMode, BacklightStatus, GetBacklightResponse } from './backlight.interface';
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

	clearCache() {
		this.cache$ = null;
	}

	setBacklight(mode: BacklightMode) {
		return from(this.backlightFeature.setBacklight({
			settingList: [{
				setting: [
					{
						key: 'KeyboardBacklightStatus',
						value: mode.value
					}
				]
			}]
		}));
	}

	getBacklightOnSystemChange(): Observable<GetBacklightResponse> {
		// const request = new ComposerRequest(
		// 	KeyBoardContract.CONTRACT,
		// 	KeyBoardContract.GET_BACKLIGHT_ON_SYSTEM_CHANGE,
		// 	{
		// 		settingList: [
		// 			{
		// 				setting: [
		// 					{
		// 						key: 'IntermediateResponseDuration',
		// 						value: '00:01:00',
		// 						enabled: 0
		// 					}
		// 				]
		// 			}
		// 		]
		// 	},
		// 	{reportProgress: true}
		// );
		// return this.composer.request<GetBacklightResponse>(request);
		return new Observable((observer) => {
			this.backlightFeature.GetBacklightOnSystemChange(
				{
					settingList: [
						{
							setting: [
								{
									key: 'IntermediateResponseDuration',
									value: '00:00:30',
									enabled: 0
								}
							]
						}
					]
				},
				response => {
					observer.next(response);
				}
			).then(
				response => {
					observer.next(response);
					observer.complete();
				},
				result => {
					observer.error(result);
				}
			)

			return () => {
			}
		});
	}
}
