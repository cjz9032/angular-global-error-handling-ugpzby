import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { concatMap, map, mergeMap, switchMap, takeWhile, tap, throttleTime } from 'rxjs/operators';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { StringBooleanEnum } from '../../../../../../data-models/common/common.interface';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';
import { CommonService } from '../../../../../../services/common/common.service';
import { FnLockStatus, KeyType, PrimaryKeySetting } from './top-row-functions-ideapad.interface';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';

@Component({
	selector: 'vtr-top-row-functions-ideapad',
	templateUrl: './top-row-functions-ideapad.component.html',
	styleUrls: ['./top-row-functions-ideapad.component.scss']
})
export class TopRowFunctionsIdeapadComponent implements OnInit, OnDestroy {
	keyType = KeyType;
	// private capability$;
	private primaryKey$: Observable<PrimaryKeySetting>;

	update$ = new Subject<KeyType>();
	private setSubscription: Subscription;
	private hotKeySubscription: Subscription;
	private functionKeySubscription: Subscription;

	hotkey$: Observable<boolean>;
	fnkey$: Observable<boolean>;
	private fnLockStatus$: Observable<FnLockStatus>;
	private fnLockSubject$: Subject<FnLockStatus> = new Subject<FnLockStatus>();
	public functionLockUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];

	private readonly functionKeyId = 'ideapad-function-key-radio-button';
	private readonly specialKeyId = 'ideapad-special-key-radio-button';

	constructor(
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService,
		private metrics: CommonMetricsService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private ngZone: NgZone
	) {
	}

	ngOnInit() {
		// this.capability$ = this.topRowFunctionsIdeapadService.capability;
		this.primaryKey$ = this.topRowFunctionsIdeapadService.primaryKey;
		this.fnLockStatus$ = this.topRowFunctionsIdeapadService.fnLockStatus;

		const fnLockStream$ = merge(this.fnLockStatus$, this.fnLockSubject$);
		// const inUseStream$ = combineLatest([this.primaryKey$, fnLockStream$]);
		this.hotkey$ = fnLockStream$
			.pipe(
				mergeMap(x => this.primaryKey$.pipe(map(primaryKeyResponse => [primaryKeyResponse, x]))),
				map(([primaryKeyResponse, fnLockStatusResponse]) => {
					return (primaryKeyResponse.value === this.keyType.HOTKEY && fnLockStatusResponse.value === StringBooleanEnum.FALSY)
						|| (primaryKeyResponse.value !== this.keyType.HOTKEY && fnLockStatusResponse.value === StringBooleanEnum.TRUTHY);
				}),
				tap(status => of(status).pipe(
					takeWhile(status1 => status1),
					tap(() => {
						const machineFamilyName = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineFamilyName);

						this.metrics.sendMetrics(
							KeyType.HOTKEY
							, 'radio.TopRowFunctionsIdeapad'
							, CommonMetricsModel.ParentDeviceSettings
							, CommonMetricsModel.ItemType
							, { machineFamilyName }
						);
					})
				))
			);
		this.fnkey$ = fnLockStream$
			.pipe(
				mergeMap(x => this.primaryKey$.pipe(map(primaryKeyResponse => [primaryKeyResponse, x]))),
				map(([primaryKeyResponse, fnLockStatusResponse]) => {
					return (primaryKeyResponse.value === this.keyType.FNKEY && fnLockStatusResponse.value === StringBooleanEnum.FALSY)
						|| (primaryKeyResponse.value !== this.keyType.FNKEY && fnLockStatusResponse.value === StringBooleanEnum.TRUTHY);
				}),
				tap(status => of(status).pipe(
					takeWhile(status1 => status1),
					tap(() => {
						const machineFamilyName = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineFamilyName);

						this.metrics.sendMetrics(
							KeyType.FNKEY
							, 'radio.TopRowFunctionsIdeapad'
							, CommonMetricsModel.ParentDeviceSettings
							, CommonMetricsModel.ItemType
							, { machineFamilyName }
						);
					})
				))
			);

		/**
		 * Directly send setFnLockStatus request no matter if it is already selected.
		 */
		this.setSubscription = this.update$
			.pipe(
				throttleTime(100),
				mergeMap(keyType => this.primaryKey$.pipe(map(primaryKey => keyType === primaryKey.value ? StringBooleanEnum.FALSY : StringBooleanEnum.TRUTHY))),
				switchMap(stringBoolean => this.topRowFunctionsIdeapadService.setFnLockStatus(stringBoolean)),
				concatMap(() => this.topRowFunctionsIdeapadService.fnLockStatus)
			)
			.subscribe(res => this.fnLockSubject$.next(res));

		this.updateFunctionLockUIModel();
		this.subscribeForDataChange();
	}

	ngOnDestroy() {
		if (this.setSubscription) {
			this.setSubscription.unsubscribe();
		}
		if (this.hotKeySubscription) {
			this.hotKeySubscription.unsubscribe();
		}
		if (this.functionKeySubscription) {
			this.functionKeySubscription.unsubscribe();
		}
	}

	updateFunctionLockUIModel() {
		this.functionLockUIModel = [];
		this.functionLockUIModel.push({
			componentId: this.specialKeyId,
			label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.sFunKey`,
			value: 'special-key',
			isChecked: false,
			isDisabled: false,
			processIcon: true,
			customIcon: 'Special-function',
			hideIcon: true,
			processLabel: false,
			metricsItem: 'radio.top-row-fn.special-function'
		});
		this.functionLockUIModel.push({
			componentId: this.functionKeyId,
			label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.fnKey`,
			value: 'function-key',
			isChecked: false,
			isDisabled: false,
			processIcon: true,
			customIcon: 'F1-F12-funciton',
			hideIcon: true,
			processLabel: false,
			metricsItem: 'radio.top-row-fn.function-key'
		});
	}

	updateFunctionLockValue(componentId: string, value: boolean) {
		if (this.functionLockUIModel && this.functionLockUIModel.length > 0) {
			this.functionLockUIModel.forEach((model) => {
				if (model.componentId === componentId) {
					model.isChecked = value;
				}
			});
		}
	}

	subscribeForDataChange() {
		this.hotKeySubscription = this.hotkey$.subscribe(value => {
			this.ngZone.run(() => {
				this.updateFunctionLockValue(this.specialKeyId, value);
			});
		});

		this.functionKeySubscription = this.fnkey$.subscribe(value => {
			this.ngZone.run(() => {
				this.updateFunctionLockValue(this.functionKeyId, value);
			});
		});
	}


	onFunctionLockRadioChange($event: UiCircleRadioWithCheckBoxListModel) {
		if ($event) {
			const componentId = $event.componentId.toLowerCase();
			if (componentId === this.specialKeyId) {
				this.update$.next(this.keyType.HOTKEY);
			} else if (componentId === this.functionKeyId) {
				this.update$.next(this.keyType.FNKEY);
			}
		}
	}
}
