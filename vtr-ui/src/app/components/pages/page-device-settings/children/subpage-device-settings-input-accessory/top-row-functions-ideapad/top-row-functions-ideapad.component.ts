import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';
import {
	GetFnLockStatusResponse,
	GetPrimaryKeyResponse,
	KeyType,
	StringBoolean,
	StringBooleanEnum
} from './top-row-functions-ideapad.interface';
import { forkJoin, Observable, Subject, Subscription, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
	selector: 'vtr-top-row-functions-ideapad',
	templateUrl: './top-row-functions-ideapad.component.html',
	styleUrls: ['./top-row-functions-ideapad.component.scss']
})
export class TopRowFunctionsIdeapadComponent implements OnInit, OnDestroy {
	keyType = KeyType;
	private capability$;
	private primaryKey$: Observable<GetPrimaryKeyResponse>;
	private primaryKeySubscription: Subscription;

	update$ = new Subject<KeyType>();
	private setSubscription: Subscription;

	hotkey$: Observable<boolean>;
	fnkey$: Observable<boolean>;
	private fnLockStatus$: Observable<GetFnLockStatusResponse>;

	constructor(
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService
	) {
	}

	ngOnInit() {
		this.capability$ = this.topRowFunctionsIdeapadService.capability;
		this.primaryKey$ = this.topRowFunctionsIdeapadService.primaryKey;
		this.fnLockStatus$ = this.topRowFunctionsIdeapadService.fnLockStatus;

		const inUserStream$ = forkJoin([this.primaryKey$, this.fnLockStatus$]);
		this.hotkey$ = inUserStream$
			.pipe(
				map(([primaryKeyResponse, fnLockStatusResponse]) => {
					return (primaryKeyResponse.primeKey === this.keyType.HOTKEY && fnLockStatusResponse.fnLock)
						|| (primaryKeyResponse.primeKey !== this.keyType.HOTKEY && !fnLockStatusResponse.fnLock);
				})
			);
		this.fnkey$ = inUserStream$
			.pipe(
				map(([primaryKeyResponse, fnLockStatusResponse]) => {
					return (primaryKeyResponse.primeKey === this.keyType.FNKEY && fnLockStatusResponse.fnLock)
						|| (primaryKeyResponse.primeKey !== this.keyType.FNKEY && !fnLockStatusResponse.fnLock);
				})
			);

		/**
		 * Directly send setFnLockStatus request no matter if it is already selected.
		 */
		this.setSubscription = zip(this.primaryKey$, this.update$)
			.pipe(
				map<[GetPrimaryKeyResponse, KeyType], StringBoolean>(([primaryKey, keyType]) => keyType === primaryKey.primeKey ? StringBooleanEnum.FALSY : StringBooleanEnum.TRUTHY),
				switchMap(stringBoolean => this.topRowFunctionsIdeapadService.setFnLockStatus(stringBoolean))
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.primaryKeySubscription.unsubscribe();
		this.setSubscription.unsubscribe();
	}

}
