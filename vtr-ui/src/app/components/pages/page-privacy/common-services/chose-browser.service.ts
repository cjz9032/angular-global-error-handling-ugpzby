import { Injectable } from '@angular/core';
import { StorageService } from '../shared/services/storage.service';
import { VantageCommunicationService } from './vantage-communication.service';

@Injectable({
	providedIn: 'root'
})
export class ChoseBrowserService {

	constructor(
		private storageService: StorageService,
		private figleafVantageService: VantageCommunicationService
	) {
	}

	getBrowserList() {
		return this.figleafVantageService.getInstalledBrowsers();
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
