import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BacklightService } from './backlight.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { catchError, flatMap, pluck, share, switchMap, takeWhile, tap, throttleTime } from 'rxjs/operators';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';
import { BacklightLevel, BacklightMode, BacklightStatus } from './backlight.interface';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';
import { CommonService } from '../../../../../../services/common/common.service';
import { MetricService } from '../../../../../../services/metric/metric.service';

@Component({
	selector: 'vtr-backlight',
	templateUrl: './backlight.component.html',
	styleUrls: ['./backlight.component.scss']
})
export class BacklightComponent implements OnInit, OnDestroy {
	@Input() isLastChild = false;
	backlightLevelEnum = BacklightLevelEnum;
	backlightStatusEnum = BacklightStatusEnum;
	modes: BacklightMode[] = [
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.low',
			value: BacklightStatusEnum.LEVEL_1,
			checked: false
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.high',
			value: BacklightStatusEnum.LEVEL_2,
			checked: false
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.off',
			value: BacklightStatusEnum.OFF,
			checked: false
		},
	];
	modeAuto: BacklightMode = {
		title: 'device.deviceSettings.inputAccessories.backlight.level.auto',
		value: BacklightStatusEnum.AUTO,
		checked: false
	};

	private backlightFlat$: Observable<BacklightStatus | BacklightLevel>;
	private level$: Observable<BacklightLevel>;
	supportType$: Observable<BacklightLevelEnum>;
	// private modesAuto$: Observable<BacklightMode[]>;
	// modes$: Observable<BacklightMode[]>;
	private status$: Observable<BacklightStatus>;
	private checked$: Observable<BacklightStatusEnum>;

	update$ = new Subject<BacklightMode>();
	private setSubscription: Subscription;
	isSwitchChecked = false;
	private oneLevelSubscription: Subscription;
	private autoSubscription: Subscription;
	private twoLevelSubscription: Subscription;

	constructor(
		private backlightService: BacklightService,
		private commonService: CommonService,
		private metrics: MetricService
	) {
	}

	ngOnInit() {
		this.backlightFlat$ = this.backlightService.backlight.pipe(
			flatMap(x => x),
			share()
		);

		this.level$ = this.backlightFlat$.pipe(takeWhile<BacklightLevel>(item => item.key === 'KeyboardBacklightLevel'));
		// Auto subscribe by pipe async
		this.supportType$ = this.level$.pipe(pluck('value'));

		this.status$ = this.backlightFlat$.pipe(takeWhile<BacklightStatus>(item => item.key === 'KeyboardBacklightStatus'));
		this.checked$ = this.status$.pipe(pluck('value'));

		// For ONE_LEVEL
		this.oneLevelSubscription = this.level$
			.pipe(
				takeWhile((item) => item.value === BacklightLevelEnum.ONE_LEVEL),
				switchMap(() => this.status$)
			)
			.subscribe(status => {
				this.isSwitchChecked = status.value !== BacklightStatusEnum.OFF;
			});

		this.setSubscription = this.update$
			.pipe(
				tap(update => {
					const machineFamilyName = this.commonService.getLocalStorageValue(LocalStorageKey.MachineFamilyName);
					const metricsData = {
						ItemParent: 'Device.MyDeviceSettings',
						ItemName: 'BacklightIdeapad',
						ItemParam: {machineFamilyName},
						ItemValue: update.value
					};
					this.metrics.sendMetrics(metricsData);
				}),
				switchMap(update => this.backlightService.setBacklight(update)),
				// Throttle !!!!!!! Cause Common ui component fire two times !!!!!!!!!!!
				throttleTime(300),
				catchError((error, caught) => {
					this.backlightService.forceReload();
					return caught;
				})
			)
			.subscribe();

		this.autoSubscription = this.level$
			.pipe(
				takeWhile(item => item.value === BacklightLevelEnum.TWO_LEVELS_AUTO),
				tap(() => this.modes.push(this.modeAuto)),
				switchMap(() => this.status$),
			)
			.subscribe((status) => {
				for (const mode of this.modes) {
					if (mode.value === status.value) {
						mode.checked = true;
					}
				}
			});
		this.twoLevelSubscription = this.level$
			.pipe(
				takeWhile(item => item.value === BacklightLevelEnum.TWO_LEVELS),
				switchMap(() => this.status$),
			)
			.subscribe((status) => {
				for (const mode of this.modes) {
					if (mode.value === status.value) {
						mode.checked = true;
					}
				}
			});
		this.update$.subscribe(mode => {
			for (const modeItem of this.modes) {
				modeItem.checked = false;
			}
			mode.checked = true;
		});
	}

	ngOnDestroy(): void {
		if (this.setSubscription) {
			this.setSubscription.unsubscribe();
		}
		if (this.oneLevelSubscription) {
			this.oneLevelSubscription.unsubscribe();
		}
		if (this.twoLevelSubscription ) {
			this.twoLevelSubscription.unsubscribe();
		}
		if (this.autoSubscription ) {
			this.autoSubscription.unsubscribe();
		}
		this.backlightService.clearCache();
	}

	onToggleOnOff($event) {
		if ($event.switchValue) {
			this.update$.next({
				title: 'device.deviceSettings.inputAccessories.backlight.level.low',
				value: BacklightStatusEnum.LEVEL_1,
				checked: false
			});
		} else {
			this.update$.next({
				title: 'device.deviceSettings.inputAccessories.backlight.level.off',
				value: BacklightStatusEnum.OFF,
				checked: false
			});
		}
	}
}
