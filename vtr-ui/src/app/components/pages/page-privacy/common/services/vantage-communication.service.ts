import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { EMPTY, from, Observable, throwError } from 'rxjs';

export enum BrowserListType {
	chrome = 'chrome',
	firefox = 'firefox',
	edge = 'edge'
}

export interface InstalledBrowsers {
	browsers: BrowserListType[];
}

type BrowserListKey = keyof typeof BrowserListType;
export type AccessiblePasswords = {
	[browser in BrowserListKey]: number;
};

export interface MaskedPasswordsInfo {
	url: string;
	login: string;
	password: string;
	domain: string;
}

export type MaskedPasswords = {
	[browser in BrowserListKey]: MaskedPasswordsInfo[];
};

export interface VisitedWebsitesInfo {
	domain: string;
	totalVisitsCount: string;
	lastVisitTimeUtc: string;
}

export interface VisitedWebsites {
	visitedWebsites: VisitedWebsitesInfo[];
}

@Injectable({
	providedIn: 'root'
})
export class VantageCommunicationService {

	constructor(private vantageShellService: VantageShellService) {
	}

	getInstalledBrowsers() {
		const contract = this.getContractObject(
			'VantageService.BrowserInfo',
			'Get-InstalledBrowsers',
			''
		);

		return this.sendContractToPrivacyCore<InstalledBrowsers>(contract).pipe(
			tap((response) => console.log('sendContractToPrivacyCore', response)),
			shareReplay(1),
			catchError((err) => {
				console.error('InstalledBrowsers err', err);
				return EMPTY;
			})
		);
	}

	getAccessiblePasswords(browsers: string[]) {
		const contract = this.getContractObject(
			'VantageService.BrowserInfo',
			'Get-AccessiblePasswords',
			JSON.stringify({
				browsers,
				userName: 'current'
			})
		);

		return this.sendContractToPrivacyCore<AccessiblePasswords>(contract).pipe(
			tap((response) => console.log('getAccessiblePasswords', response)),
			catchError((err) => {
				console.error('AccessiblePasswords err', err);
				return EMPTY;
			})
		);
	}

	getMaskedPasswords(browsers: string[]) {
		const contract = this.getContractObject(
			'VantageService.BrowserInfo',
			'Get-MaskedPasswords',
			JSON.stringify({
				browsers,
				userName: 'current'
			})
		);

		return this.sendContractToPrivacyCore<MaskedPasswords>(contract).pipe(
			tap((val) => console.log('MaskedPasswords', val)),
			catchError((err) => {
				console.error('MaskedPasswords err', err);
				return EMPTY;
			})
		);
	}

	getVisitedWebsites() {
		return this.getInstalledBrowsers().pipe(
			map((installedBrowsers) => this.getContractObject(
					'VantageService.BrowserInfo',
					'Get-VisitedWebsites',
					JSON.stringify({
						browsers: installedBrowsers.browsers,
						userName: 'current',
						topVisited: '50'
					})
				)),
			switchMap((contract) => this.sendContractToPrivacyCore<VisitedWebsites>(contract).pipe(
				catchError((err) => {
					return throwError('VisitedWebsites err', err);
				})
			)),
			tap((response) => console.log('getVisitedWebsites', response)),
		);
	}

	openInstaller() {
		if (this.vantageShellService.getPrivacyCore()) {
			return from(this.vantageShellService.getPrivacyCore().openInstaller());
		} else {
			return EMPTY;
		}
	}

	openFigleafByUrl(link) {
		if (this.vantageShellService.getPrivacyCore()) {
			return from(this.vantageShellService.getPrivacyCore().openFigleafByUrl(link));
		} else {
			return EMPTY;
		}
	}

	openUri(uri: string) {
		if (this.vantageShellService.getPrivacyCore()) {
			return from(this.vantageShellService.getPrivacyCore().openUriInDefaultBrowser(uri));
		} else {
			return EMPTY;
		}
	}

	private getContractObject(contract: string, command: string, payload?: string) {
		return {
			contract,
			command,
			payload: payload ? payload : ''
		};
	}

	private sendContractToPrivacyCore<T>(contract: { contract: string, command: string, payload: string | object }): Observable<T> {
		if (this.vantageShellService.getPrivacyCore()) {
			return from(this.vantageShellService.getPrivacyCore().sendContractToPlugin(contract)) as Observable<T>;
		} else {
			console.error('JS bridge error');
			return EMPTY;
		}
	}
}
