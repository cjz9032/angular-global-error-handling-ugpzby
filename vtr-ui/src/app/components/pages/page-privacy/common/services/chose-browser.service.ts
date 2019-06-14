import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BrowserListType, VantageCommunicationService } from './vantage-communication.service';
import { map } from 'rxjs/operators';
import { convertBrowserNameToBrowserData } from '../../utils/helpers';

@Injectable({
	providedIn: 'root'
})
export class ChoseBrowserService {

	constructor(
		private storageService: StorageService,
		private vantageCommunicationService: VantageCommunicationService,
	) {
	}

	getBrowserList() {
		return this.vantageCommunicationService.getInstalledBrowsers().pipe(
			map((response) => {
				const defaultBrowsers = [BrowserListType.chrome, BrowserListType.firefox, BrowserListType.edge];
				return response.browsers.length === 0 ? defaultBrowsers : response.browsers;
			}),
			map((browsers) => convertBrowserNameToBrowserData(browsers)),
			map((browsers) => browsers.filter((browser) => browser.name !== 'edge')),
		);
	}

	isBrowserListEmpty() {
		return this.vantageCommunicationService.getInstalledBrowsers().pipe(
			map((response) => response.browsers.length === 0)
		);
	}

	setBrowser(browserId: string) {
		this.storageService.setItem('userChoseBrowser', browserId);
	}

	getName() {
		return this.storageService.getItem('userChoseBrowser');
	}

	isBrowserChose(): boolean {
		return Boolean(this.storageService.getItem('userChoseBrowser'));
	}
}
