import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BacklightService } from './backlight.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, flatMap, pluck, switchMap, takeWhile } from 'rxjs/operators';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';
import { BacklightLevel, BacklightMode, BacklightStatus } from './backlight.interface';

@Component({
	selector: 'vtr-backlight',
	templateUrl: './backlight.component.html',
	styleUrls: ['./backlight.component.scss']
})
export class BacklightComponent implements OnInit, OnDestroy {
	@Input() isLastChild = false;
	// TODO: remove type BacklightStatusEnum
	supportType$: Observable<BacklightLevelEnum | BacklightStatusEnum>;
	backlightLevelEnum = BacklightLevelEnum;
	modes: BacklightMode[] = [
		{
			title: 'device.deviceSettings.inputAccessories.inputAccessory.Backlight.level.low',
			value: BacklightStatusEnum.LEVEL_1,
			checked: false
		},
		{
			title: 'device.deviceSettings.inputAccessories.inputAccessory.Backlight.level.high',
			value: BacklightStatusEnum.LEVEL_2,
			checked: false
		},
		{
			title: 'device.deviceSettings.inputAccessories.inputAccessory.Backlight.level.off',
			value: BacklightStatusEnum.OFF,
			checked: false
		},
	];
	modeAuto: BacklightMode = {
		title: 'device.deviceSettings.inputAccessories.inputAccessory.Backlight.level.Auto',
		value: BacklightStatusEnum.AUTO,
		checked: false
	};

	update$ = new Subject<BacklightMode>();
	private setSubscription: Subscription;
	private backlightFlat$: Observable<BacklightStatus | BacklightLevel>;
	private level$: Observable<BacklightStatus | BacklightLevel>;

	constructor(
		private backlightService: BacklightService
	) {
	}

	ngOnInit() {
		this.backlightFlat$ = this.backlightService.backlight.pipe(flatMap(x => x));

		this.level$ = this.backlightFlat$.pipe(takeWhile(item => item.key === 'KeyboardBacklightLevel'));
		// Auto subscribe by pipe async
		this.supportType$ = this.level$.pipe(pluck('value'));
		// this.modes$ = this.level$.pipe(
		// 	takeWhile(item => item.value === BacklightLevelEnum.TWO_LEVELS_AUTO)
		// );

		this.setSubscription = this.update$
			.pipe(
				debounceTime(300),
				switchMap( (update) => this.backlightService.setBacklight(update)),
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		if (this.setSubscription) {
			this.setSubscription.unsubscribe();
		}
	}

}
