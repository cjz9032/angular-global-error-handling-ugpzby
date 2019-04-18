import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreachedAccountMode } from '../../common-ui/breached-account/breached-account.component';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { BrowserAccountsService } from '../../common-services/browser-accounts.service';
import { BreachedAccountsService, BreachedAccount } from '../../common-services/breached-accounts.service';
import { CommunicationWithFigleafService } from '../../communication-with-figleaf/communication-with-figleaf.service';
import { FigleafOverviewService } from '../../common-services/figleaf-overview.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss', './privacy-dashboard.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
	readonly breachedAccountMode = BreachedAccountMode;

	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	figleafDashboard = this.figleafOverviewService.figleafDashboard$;

	isConsentToGetBrowsersAccountsGiven$ = this.browserAccountsService.isConsentGiven$;

	breached_accounts: BreachedAccount[] = [];
	breached_accounts_show: BreachedAccount[];
	// static Data for html
	browserStoredAccountsData = {showDetailAction: 'link'};

	constructor(
		private router: Router,
		private browserAccountsService: BrowserAccountsService,
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private figleafOverviewService: FigleafOverviewService,
	) {
	}

	ngOnInit() {
		this.breached_accounts_show = this.breached_accounts.slice(0, 3);
		this.breachedAccountsService.onGetBreachedAccounts$
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe((breachedAccounts) => {
				this.breached_accounts = breachedAccounts;
				this.breached_accounts_show = this.breached_accounts.slice(0, 3);
			});

		this.breachedAccountsService.getBreachedAccounts();
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
		this.browserAccountsService.getInstalledBrowsersDefaultData();
	}
}
