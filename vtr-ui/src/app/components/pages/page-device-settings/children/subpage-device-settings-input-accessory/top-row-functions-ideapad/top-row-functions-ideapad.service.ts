import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import {
	Capability, GetFnLockStatusResponse,
	GetPrimaryKeyResponse,
	StringBoolean,
	TopRowFunctionsIdeapad
} from './top-row-functions-ideapad.interface';
import { from, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
	providedIn: 'root'
})
export class TopRowFunctionsIdeapadService {
	topRowFunctionsIdeaPadFeature: TopRowFunctionsIdeapad;
	private capability$: Observable<Capability[]>;
	private primaryKey$: Observable<GetPrimaryKeyResponse>;
	private fnLockStatus$: Observable<GetFnLockStatusResponse>;

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

	requestCapability(): Observable<Capability[]> {
		return from(this.topRowFunctionsIdeaPadFeature.getCapability())
			.pipe(
				map(res => res.payload.capabilityList)
			);
	}

	get primaryKey(): Observable<GetPrimaryKeyResponse> {
		if (!this.primaryKey$) {
			this.primaryKey$ = this.requestPrimaryKey().pipe(
				shareReplay(CACHE_SIZE)
			);
		}
		return this.primaryKey$;
	}

	requestPrimaryKey(): Observable<GetPrimaryKeyResponse> {
		return from(this.topRowFunctionsIdeaPadFeature.getPrimaryKey())
			.pipe(
				map(res => res.payload)
			);
	}

	get fnLockStatus(): Observable<GetFnLockStatusResponse> {
		if (!this.fnLockStatus$) {
			this.fnLockStatus$ = this.requestFnLockStatus().pipe(
				shareReplay(CACHE_SIZE)
			);
		}
		return this.fnLockStatus$;
	}

	requestFnLockStatus(): Observable<GetFnLockStatusResponse> {
		return from(this.topRowFunctionsIdeaPadFeature.getFnLockStatus())
			.pipe(
				map(res => res.payload)
			);
	}

	setFnLockStatus(fnLock: StringBoolean) {
		// Every time set new fnLock status clear the cache.
		this.fnLockStatus$ = null;
		return from(this.topRowFunctionsIdeaPadFeature.setFnLockStatus(fnLock));
	}
}
