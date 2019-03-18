import { Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonPopupService } from '../common-services/popups/common-popup.service';
import { ChoseBrowserService } from '../common-services/chose-browser.service';
import { LocationHistoryService } from '../shared/services/location-history.service';
import { PRIVACY_BASE_URL } from '../shared/injection-tokens';

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
