import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreachedAccountMode } from '../../common-ui/breached-account/breached-account.component';
import { Router } from '@angular/router';
import { EmailScannerService } from '../../common-services/email-scanner.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { BrowserAccountsService } from '../../common-services/browser-accounts.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
	readonly breachedAccountMode = BreachedAccountMode;

	isEmailWasScanned = false;

	isConsentToGetBrowsersAccountsGiven$ = this.browserAccountsService.isConsentGiven$;

	userEmail: string;
	breached_accounts: any[];
	breached_accounts_show: any[];
	// static Data for html
	browserStoredAccountsData = {showDetailAction: 'link'};

	// Static Data for html
	firstEmailScanData = {
		title: 'Check my privacy level',
	};
	nextEmailScanData = {
		title: 'We didn’t find any breached accounts',
	};

	constructor(
		private router: Router,
		private emailScannerService: EmailScannerService,
		private browserAccountsService: BrowserAccountsService,
	) {
	}

	ngOnInit() {
		this.breached_accounts = this.emailScannerService.breachedAccounts;
		this.breached_accounts_show = this.breached_accounts.slice(0, 3);
		this.userEmail = this.emailScannerService.userEmail;
		this.isEmailWasScanned = !!this.emailScannerService.getAccessToken();
		this.emailScannerService.onGetBreachedAccounts$.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe((breachedAccounts) => {
			this.breached_accounts = breachedAccounts;
			this.breached_accounts_show = this.breached_accounts.slice(0, 3);
			this.userEmail = this.emailScannerService.userEmail;
			this.isEmailWasScanned = true;
		});

		if (this.isConsentToGetBrowsersAccountsGiven$.getValue()) {
			this.getBrowserAccountsDetail();
		}
	}

	ngOnDestroy() {
	}

	redirectToDetailPage(index: number) {
		this.router.navigate(['privacy', 'breaches'], {queryParams: {openId: index}});
	}

	giveConcentToGetBrowserAccounts() {
		this.browserAccountsService.giveConcent();
		this.getBrowserAccountsDetail();
	}

	getBrowserAccountsDetail() {
		const browsersNamesArray = Object.keys(this.browserAccountsService.installedBrowsersData$.getValue());
		this.browserAccountsService.getBrowserAccounts(browsersNamesArray);
		this.browserAccountsService.getBrowserAccountsDetail();
	}
}
