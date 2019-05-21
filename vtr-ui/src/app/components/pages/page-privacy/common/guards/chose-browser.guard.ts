import { Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonPopupService } from '../services/popups/common-popup.service';
import { ChoseBrowserService } from '../services/chose-browser.service';
import { LocationHistoryService } from '../services/location-history.service';
import { PRIVACY_BASE_URL } from '../../utils/injection-tokens';

export class ChoseBrowserGuard implements CanActivate {
	constructor(
		private commonPopupService: CommonPopupService,
		private choseBrowserService: ChoseBrowserService,
		private locationHistoryService: LocationHistoryService,
		private router: Router,
		@Inject(PRIVACY_BASE_URL) private baseUrl: string,
		) {
	}

	canActivate() {
		if (this.choseBrowserService.isBrowserChose()) {
			return true;
		}

		this.commonPopupService.open('choseBrowserPopup');

		const urlForRedirect = this.locationHistoryService.getPreviousUrl() ?
			this.locationHistoryService.getCurrentUrl() :
			this.baseUrl;

		return this.router.navigateByUrl(urlForRedirect);
	}
}
