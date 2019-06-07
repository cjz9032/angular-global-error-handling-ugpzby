import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { EmailScannerService } from '../services/email-scanner.service';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { SafeStorageService } from '../../../common/services/safe-storage.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { FeaturesStatuses } from '../../../userDataStatuses';

@Component({
	selector: 'vtr-email-scanner',
	templateUrl: './email-scanner.component.html',
	styleUrls: ['./email-scanner.component.scss'],

})
export class EmailScannerComponent implements OnInit, OnDestroy {
	userEmail = this.safeStorageService.getEmail();
	emailWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.undefined &&
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.error)
	);

	// Static Data for html
	firstEmailScanData = {
		title: 'Check email for breaches',
	};
	nextEmailScanData = {
		title: 'We didn’t find any breached accounts',
	};

	constructor(
		private emailScannerService: EmailScannerService,
		private safeStorageService: SafeStorageService,
		private userDataGetStateService: UserDataGetStateService,
	) {
	}

	ngOnInit() {
		this.emailScannerService.userEmail$
			.pipe(
				filter(Boolean),
				takeUntil(instanceDestroyed(this))
			)
			.subscribe((userEmail) => {
				this.userEmail = userEmail;
			});
	}

	ngOnDestroy() {
	}

}
