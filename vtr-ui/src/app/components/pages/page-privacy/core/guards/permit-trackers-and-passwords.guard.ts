import { Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonPopupService } from '../services/popups/common-popup.service';
import { LocationHistoryService } from '../services/location-history.service';
import { PRIVACY_BASE_URL } from '../../utils/injection-tokens';
import { UserAllowService } from '../services/user-allow.service';

export class PermitTrackersAndPasswordsGuard implements CanActivate {
	constructor(
		private commonPopupService: CommonPopupService,
		private userAllowService: UserAllowService,
		private locationHistoryService: LocationHistoryService,
		private router: Router,
		@Inject(PRIVACY_BASE_URL) private baseUrl: string,
		) {
	}

	canActivate() {
		if (this.userAllowService.allowToShow.getValue().trackingMap) {
			return true;
		}

		this.commonPopupService.open('permitTrackersAndPasswordsPopup');

		const urlForRedirect = this.locationHistoryService.getPreviousUrl() ?
			this.locationHistoryService.getCurrentUrl() :
			this.baseUrl;

		return this.router.navigateByUrl(urlForRedirect);
	}
}
