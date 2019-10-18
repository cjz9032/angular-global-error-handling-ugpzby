import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import {
	CapabilityTemp, FnLockStatus, GetFnLockStatusResponse,
	GetPrimaryKeyResponse, PrimaryKeySetting,
	StringBoolean,
	TopRowFunctionsIdeapad
} from './top-row-functions-ideapad.interface';
import { from, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
	providedIn: 'root'
})
export class TopRowFunctionsIdeapadService {
	topRowFunctionsIdeaPadFeature: TopRowFunctionsIdeapad;
	private capability$: Observable<CapabilityTemp[]>;
	private primaryKey$: Observable<PrimaryKeySetting>;
	private fnLockStatus$: Observable<FnLockStatus>;

	constructor(
		private shellService: VantageShellService
	) {
		this.topRowFunctionsIdeaPadFeature = this.shellService.getTopRowFunctionsIdeapad();
	}

	get capability() {
		if (!this.capability$) {
			this.capability$ = this.requestCapability().pipe(
				shareReplay(CACHE_SIZE)
			);
		}
		return this.capability$;
	}

	requestCapability(): Observable<CapabilityTemp[]> {
		return from(this.topRowFunctionsIdeaPadFeature.getCapability())
			.pipe(
				map(res => res.capabilityList.Items)
			);
	}

	get primaryKey(): Observable<PrimaryKeySetting> {
		if (!this.primaryKey$) {
			this.primaryKey$ = this.requestPrimaryKey().pipe(
				shareReplay(CACHE_SIZE)
			);
		}
		return this.primaryKey$;
	}

	requestPrimaryKey(): Observable<PrimaryKeySetting> {
		return from(this.topRowFunctionsIdeaPadFeature.getPrimaryKey())
			.pipe(
				tap(res => console.log('=======================================================================================', JSON.stringify(res))),
				map(res => res.settingList.setting.find(item => item.key === 'PrimeKey'))
			);
	}

	get fnLockStatus(): Observable<FnLockStatus> {
		if (!this.fnLockStatus$) {
			this.fnLockStatus$ = this.requestFnLockStatus().pipe(
				shareReplay(CACHE_SIZE)
			);
		}
		return this.fnLockStatus$;
	}

	requestFnLockStatus(): Observable<FnLockStatus> {
		return from(this.topRowFunctionsIdeaPadFeature.getFnLockStatus())
			.pipe(
				tap(res => console.log('===============================================================================FnLock', JSON.stringify(res))),
				map(res => res.settingList.setting.find(item => item.key === 'FnLock'))
			);
	}

	setFnLockStatus(fnLock: StringBoolean) {
		// Every time set new fnLock status clear the cache.
		this.fnLockStatus$ = null;
		return from(this.topRowFunctionsIdeaPadFeature.setFnLockStatus(fnLock));
	}
}
