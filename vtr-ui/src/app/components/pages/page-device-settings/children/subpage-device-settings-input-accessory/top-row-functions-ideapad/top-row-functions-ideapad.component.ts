import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';
import { FnLockStatus, KeyType, PrimaryKeySetting, StringBooleanEnum } from './top-row-functions-ideapad.interface';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { concatMap, map, mergeMap, switchMap, takeWhile, tap, throttleTime } from 'rxjs/operators';
import { MetricService } from '../../../../../../services/metric/metric.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { LocalStorageKey } from '../../../../../../enums/local-storage-key.enum';

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

	hotkey$: Observable<boolean>;
	fnkey$: Observable<boolean>;
	private fnLockStatus$: Observable<FnLockStatus>;
	private fnLockSubject$: Subject<FnLockStatus> = new Subject<FnLockStatus>();

	constructor(
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService,
		private metrics: MetricService,
		private commonService: CommonService
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
						const machineFamilyName = this.commonService.getLocalStorageValue(LocalStorageKey.MachineFamilyName);
						const metricsData = {
							ItemParent: 'Device.MyDeviceSettings',
							ItemName: 'TopRowFunctionsIdeapad',
							ItemParam: {machineFamilyName},
							ItemValue: KeyType.HOTKEY
						};
						this.metrics.sendMetrics(metricsData);
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
						const machineFamilyName = this.commonService.getLocalStorageValue(LocalStorageKey.MachineFamilyName);
						const metricsData = {
							ItemParent: 'Device.MyDeviceSettings',
							ItemName: 'TopRowFunctionsIdeapad',
							ItemParam: {machineFamilyName},
							ItemValue: KeyType.FNKEY
						};
						this.metrics.sendMetrics(metricsData);
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
	}

	ngOnDestroy() {
		if (this.setSubscription) {
			this.setSubscription.unsubscribe();
		}
	}

}
