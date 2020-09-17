import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import {
	catchError,
	filter,
	flatMap,
	map,
	pluck,
	repeat,
	share,
	switchMap,
	takeWhile,
	tap,
	throttleTime
} from 'rxjs/operators';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';
import { BacklightLevelEnum, BacklightStatusEnum } from './backlight.enum';
import { BacklightLevel, BacklightMode, BacklightStatus } from './backlight.interface';
import { BacklightService } from './backlight.service';

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
			checked: false,
			disabled: false
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.high',
			value: BacklightStatusEnum.LEVEL_2,
			checked: false,
			disabled: false
		},
		{
			title: 'device.deviceSettings.inputAccessories.backlight.level.off',
			value: BacklightStatusEnum.OFF,
			checked: false,
			disabled: false
		},
	];
	modeAuto: BacklightMode = {
		title: 'device.deviceSettings.inputAccessories.backlight.level.auto',
		value: BacklightStatusEnum.AUTO,
		checked: false,
		disabled: false
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
	private changeSubscription: Subscription;

	public kbBacklightUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];

	constructor(
		private backlightService: BacklightService,
		private localCacheService: LocalCacheService,
		private metrics: CommonMetricsService
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
				tap(async update => {
					const machineFamilyName = await this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineFamilyName);
					this.metrics.sendMetrics(update.value, 'BacklightIdeaPad', 'FeatureClick', machineFamilyName);
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
				tap(() => this.modes.unshift(this.modeAuto)),
				switchMap(() => this.status$),
			)
			.subscribe((status) => {
				for (const mode of this.modes) {
					mode.checked = mode.value === status.value;
					mode.disabled = status.value === BacklightStatusEnum.DISABLED_OFF;
					if (status.value === BacklightStatusEnum.DISABLED_OFF && mode.value === BacklightStatusEnum.OFF) {
						mode.checked = true;
					}
				}
				this.updateBacklightModel(this.modes);

			});
		this.twoLevelSubscription = this.level$
			.pipe(
				takeWhile(item => item.value === BacklightLevelEnum.TWO_LEVELS),
				switchMap(() => this.status$),
			)
			.subscribe((status) => {
				for (const mode of this.modes) {
					mode.checked = mode.value === status.value;
					mode.disabled = status.value === BacklightStatusEnum.DISABLED_OFF;
					if (status.value === BacklightStatusEnum.DISABLED_OFF && mode.value === BacklightStatusEnum.OFF) {
						mode.checked = true;
					}
				}
				this.updateBacklightModel(this.modes);
			});
		this.update$.subscribe(mode => {
			for (const modeItem of this.modes) {
				modeItem.checked = false;
			}
			mode.checked = true;
		});

		this.changeSubscription = this.backlightService.getBacklightOnSystemChange()
			.pipe(
				map(res => res.settingList.setting),
				flatMap(x => x),
				filter(item => item.key === 'KeyboardBacklightStatus'),
				repeat()
			)
			.subscribe(res => {
				this.isSwitchChecked = res.value !== BacklightStatusEnum.OFF;
				this.setActiveOption(res.value);
				for (const modeItem of this.modes) {
					modeItem.checked = res.value === modeItem.value;
					modeItem.disabled = res.value === BacklightStatusEnum.DISABLED_OFF;
					if (res.value === BacklightStatusEnum.DISABLED_OFF && modeItem.value === BacklightStatusEnum.OFF) {
						modeItem.checked = true;
					}
				}
			});
	}

	ngOnDestroy(): void {
		if (this.setSubscription) {
			this.setSubscription.unsubscribe();
		}
		if (this.oneLevelSubscription) {
			this.oneLevelSubscription.unsubscribe();
		}
		if (this.twoLevelSubscription) {
			this.twoLevelSubscription.unsubscribe();
		}
		if (this.autoSubscription) {
			this.autoSubscription.unsubscribe();
		}
		this.backlightService.clearCache();
		if (this.changeSubscription) {
			this.changeSubscription.unsubscribe();
		}
	}

	onToggleOnOff($event) {
		if ($event.switchValue) {
			this.update$.next({
				title: 'device.deviceSettings.inputAccessories.backlight.level.low',
				value: BacklightStatusEnum.LEVEL_1,
				checked: false,
				disabled: false
			});
		} else {
			this.update$.next({
				title: 'device.deviceSettings.inputAccessories.backlight.level.off',
				value: BacklightStatusEnum.OFF,
				checked: false,
				disabled: false
			});
		}
	}

	updateBacklightModel(response: BacklightMode[]) {
		if (response) {
			this.kbBacklightUIModel = [];
			response.forEach(mode => {
				const value = mode.value.toLocaleLowerCase();
				this.kbBacklightUIModel.push({
					componentId: `backlightMode${value}`.replace(/\s/g, ''),
					label: mode.title,
					value: mode.value,
					isChecked: mode.checked,
					isDisabled: mode.disabled,
					processIcon: true,
					customIcon: mode.value,
					hideIcon: true,
					processLabel: true,
					metricsItem: `radio.kb-backlight.${value}`
				});
			});
		}
	}


	onBacklightRadioChange($event: UiCircleRadioWithCheckBoxListModel) {
		if ($event) {
			const backlight: BacklightMode = {
				checked: true,
				value: $event.value as BacklightStatusEnum,
				disabled: false,
				title: $event.label
			};
			this.update$.next(backlight);
		}
	}

	private setActiveOption(value) {
		if (this.kbBacklightUIModel && this.kbBacklightUIModel.length > 0) {
			this.kbBacklightUIModel.forEach(model => {
				model.isChecked = (model.value === value);
				model.isDisabled = value === BacklightStatusEnum.DISABLED_OFF;
				if (value === BacklightStatusEnum.DISABLED_OFF && model.value === BacklightStatusEnum.OFF) {
					model.isChecked = true;
				}
			});
		}
	}
}
