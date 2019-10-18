import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';
import { FnLockStatus, KeyType, PrimaryKeySetting, StringBooleanEnum } from './top-row-functions-ideapad.interface';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { concatMap, map, mergeMap, switchMap, throttleTime } from 'rxjs/operators';

@Component({
	selector: 'vtr-top-row-functions-ideapad',
	templateUrl: './top-row-functions-ideapad.component.html',
	styleUrls: ['./top-row-functions-ideapad.component.scss']
})
export class TopRowFunctionsIdeapadComponent implements OnInit, OnDestroy {
	keyType = KeyType;
	private capability$;
	private primaryKey$: Observable<PrimaryKeySetting>;
	private primaryKeySubscription: Subscription;

	update$ = new Subject<KeyType>();
	private setSubscription: Subscription;

	hotkey$: Observable<boolean>;
	fnkey$: Observable<boolean>;
	private fnLockStatus$: Observable<FnLockStatus>;
	private fnLockSubject$: Subject<FnLockStatus> = new Subject<FnLockStatus>();

	constructor(
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService
	) {
	}

	ngOnInit() {
		this.capability$ = this.topRowFunctionsIdeapadService.capability;
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
				})
			);
		this.fnkey$ = fnLockStream$
			.pipe(
				mergeMap(x => this.primaryKey$.pipe(map(primaryKeyResponse => [primaryKeyResponse, x]))),
				map(([primaryKeyResponse, fnLockStatusResponse]) => {
					return (primaryKeyResponse.value === this.keyType.FNKEY && fnLockStatusResponse.value === StringBooleanEnum.FALSY)
						|| (primaryKeyResponse.value !== this.keyType.FNKEY && fnLockStatusResponse.value === StringBooleanEnum.TRUTHY);
				})
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
		this.primaryKeySubscription.unsubscribe();
		this.setSubscription.unsubscribe();
	}

}
