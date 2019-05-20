import { Injectable } from '@angular/core';
import { OneClickScanSteps } from './one-click-scan-steps.service';
import { UserAllowService } from '../../../common/services/user-allow.service';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';

@Injectable({
	providedIn: 'root'
})
export class PermitService {
	readonly oneClickScanSteps = OneClickScanSteps;

	constructor(
		private userAllowService: UserAllowService,
		private browserAccountsService: BrowserAccountsService
	) {
	}

	setPermit(permitValue: boolean, step: OneClickScanSteps) {
		switch (step) {
			case this.oneClickScanSteps.PERMIT_TRACKERS_AND_PASSWORD:
				this.setPermitTrackersAndPassword(permitValue);
				break;

		}
	}

	private setPermitTrackersAndPassword(permitValue: boolean) {
		this.userAllowService.setShowTrackingMap(permitValue);
		if (permitValue) {
			this.browserAccountsService.giveConcent();
		}
	}
}
