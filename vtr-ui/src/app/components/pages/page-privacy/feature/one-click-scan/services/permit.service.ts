import { Injectable } from '@angular/core';
import { OneClickScanSteps } from './one-click-scan-steps.service';
import { UserAllowService } from '../../../core/services/user-allow.service';
import { BrowserAccountsService } from '../../non-private-password/services/browser-accounts.service';
import { BreachedAccountsService } from '../../check-breached-accounts/services/breached-accounts.service';

@Injectable({
	providedIn: 'root'
})
export class PermitService {
	readonly oneClickScanSteps = OneClickScanSteps;
	private permitsValue: OneClickScanSteps[] = [];

	constructor(
		private userAllowService: UserAllowService,
		private browserAccountsService: BrowserAccountsService,
		private breachedAccountsService: BreachedAccountsService,
	) {
	}

	savePermit(step: OneClickScanSteps) {
		this.permitsValue.push(step);
	}

	doActionWithPermits() {
		this.permitsValue.forEach((step) => {
			switch (step) {
				case this.oneClickScanSteps.PERMIT_TRACKERS_AND_PASSWORD:
					this.setPermitTrackersAndPassword();
					break;
				case this.oneClickScanSteps.VERIFY_EMAIL:
					this.breachedAccountsService.scanNotifierEmit();
					break;
				default:
					break;
			}
		});
	}

	clearPermits() {
		this.permitsValue = [];
	}

	getPermits() {
		return this.permitsValue;
	}

	isSkipAll() {
		return this.permitsValue.length === 0;
	}

	private setPermitTrackersAndPassword() {
		this.userAllowService.setShowTrackingMap(true);
		this.browserAccountsService.giveConcent();
	}
}
