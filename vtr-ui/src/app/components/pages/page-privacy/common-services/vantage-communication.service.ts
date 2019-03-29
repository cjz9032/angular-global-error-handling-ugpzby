import { Injectable } from '@angular/core';
import { VantageShellService } from '../../../../services/vantage-shell/vantage-shell.service';
import { map } from 'rxjs/operators';

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

interface MaskedPasswordsInfo {
	url: string;
	login: string;
	password: string;
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
		this.getAccessiblePasswords(['chrome']);
		this.getMaskedPasswords(['chrome']);
		this.getVisitedWebsites(['chrome']);
	}

	getInstalledBrowsers() {
		const contract = this.getContractObject(
			'VantageService.BrowserInfo',
			'Get-InstalledBrowsers',
			''
		);

		return this.vantageShellService.sendContractToPrivacyCore<InstalledBrowsers>(contract).pipe(
			map((response) => response.browsers.map((browser) => ({
				name: browser,
				img: `/assets/images/privacy-tab/${browser}.svg`,
				value: browser
			})))
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

		return this.vantageShellService.sendContractToPrivacyCore<AccessiblePasswords>(contract).subscribe(
			(val) => console.log('AccessiblePasswords', val),
			(err) => console.log('AccessiblePasswords', err)
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

		return this.vantageShellService.sendContractToPrivacyCore<MaskedPasswords>(contract).subscribe(
			(val) => console.log('MaskedPasswords', val),
			(err) => console.log('MaskedPasswords', err)
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
