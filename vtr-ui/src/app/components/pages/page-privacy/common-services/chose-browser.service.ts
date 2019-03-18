import { Injectable } from '@angular/core';
import { StorageService } from '../shared/services/storage.service';

@Injectable({
	providedIn: 'root'
})
export class ChoseBrowserService {

	constructor(private storageService: StorageService) {
	}

	setBrowser(browserId: string) {
		this.storageService.setItem('userChoseBrowser', browserId);
	}

	isBrowserChose(): boolean {
		return Boolean(this.storageService.getItem('userChoseBrowser'));
	}
}
