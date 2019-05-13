import { Component, Input, OnInit } from '@angular/core';
import { FigleafOverviewService } from '../../common/services/figleaf-overview.service';
import { BrowserAccountsService } from '../../common/services/browser-accounts.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';

@Component({
	selector: 'vtr-non-private-password',
	templateUrl: './non-private-password.component.html',
	styleUrls: ['./non-private-password.component.scss']
})
export class NonPrivatePasswordComponent implements OnInit {
	@Input() browserStoredAccountsData: { showDetailAction: 'expand' | 'link' } = {showDetailAction: 'link'};

	figleafDashboard = this.figleafOverviewService.figleafDashboard$;

	isConsentToGetBrowsersAccountsGiven$ = this.browserAccountsService.isConsentGiven$;
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	openPasswordId$ = this.getParamFromUrl('openId').pipe(
		map((val) => Number(val)),
	);

	constructor(
		private figleafOverviewService: FigleafOverviewService,
		private browserAccountsService: BrowserAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private route: ActivatedRoute,
		private vantageCommunicationService: VantageCommunicationService,
	) {
	}

	ngOnInit() {
	}

	openFigleaf() {
		this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:');
	}

	giveConcentToGetBrowserAccounts() {
		this.browserAccountsService.giveConcent();
		this.getBrowserAccountsDetail();
	}

	getBrowserAccountsDetail() {
		this.browserAccountsService.getInstalledBrowsersDefaultData();
	}

	private getParamFromUrl(paramName) {
		return this.route.queryParams.pipe(
			filter((params) => params[paramName]),
			map((param) => param[paramName]),
		);
	}

}
