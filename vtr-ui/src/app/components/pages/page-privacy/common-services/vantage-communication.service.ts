import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../services/vantage-shell/vantage-shell.service';
import { catchError, map, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

enum BrowserList {
	chrome, firefox
}

export interface InstalledBrowsers {
	browsers: string[];
}

type BrowserListKey = keyof typeof BrowserList;
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

interface VisitedWebsitesInfo {
	domain: string;
	totalVisitsCount: string;
	lastVisitTimeUtc: string;
}

export type VisitedWebsites = {
	[browser in BrowserListKey]: VisitedWebsitesInfo[];
};

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

		return this.vantageShellService.sendContractToPrivacyCore<InstalledBrowsers>(contract).pipe(
			map((response) =>
				response.browsers.filter((browser) => browser !== 'edge')
			),
			map((browsers) => browsers.map((browser) => ({
				name: browser,
				img: `/assets/images/privacy-tab/${browser}.svg`,
				value: browser
			}))),
			tap((val) => console.log('InstalledBrowsers', val)),
			catchError((err) => {
				console.log('InstalledBrowsers', err);
				return EMPTY;
			})
		);
	}

	getAccessiblePasswords(browsers: string[]) {
		const contract = this.getContractObject(
			'VantageService.BrowserInfo',
			'Get-AccessiblePasswords',
			JSON.stringify({
				browsers
			})
		);

		return this.vantageShellService.sendContractToPrivacyCore<AccessiblePasswords>(contract).pipe(
			tap((val) => console.log('AccessiblePasswords', val)),
			catchError((err) => {
				console.log('AccessiblePasswords', err);
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
				userName: 'all'
			})
		);

		return this.vantageShellService.sendContractToPrivacyCore<MaskedPasswords>(contract).pipe(
			tap((val) => console.log('MaskedPasswords', val)),
			catchError((err) => {
				console.log('MaskedPasswords', err);
				return EMPTY;
			})
		);
	}

	getVisitedWebsites(browsers: string[]) {
		const contract = this.getContractObject(
			'VantageService.BrowserInfo',
			'Get-VisitedWebsites',
			JSON.stringify({
				browsers,
				userName: 'all',
				topVisited: '50'
			})
		);

		return this.vantageShellService.sendContractToPrivacyCore<VisitedWebsites>(contract).subscribe(
			(val) => console.log('VisitedWebsites', val),
			(err) => console.log('VisitedWebsites', err)
		);
	}

	private getContractObject(contract: string, command: string, payload?: string) {
		return {
			contract,
			command,
			payload: payload ? payload : ''
		};
	}
}
