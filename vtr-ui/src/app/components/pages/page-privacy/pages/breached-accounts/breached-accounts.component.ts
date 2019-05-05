import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BreachedAccount, BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent implements OnInit, OnDestroy {
	breached_accounts: BreachedAccount[];
	openBreachedId$ = this.getParamFromUrl('openId').pipe(map((val) => Number(val)));
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	// static Data transferred to html
	commonTexts = {
		title: 'Breached Accounts',
		text: 'Some of your personal info has been exposed for anyone to see. It happened after a site you have an account with was hacked.'
	};

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.breachedAccountsService.onGetBreachedAccounts$
			.pipe(
				takeUntil(instanceDestroyed(this)),
				map((breachedAccounts) => {
					return breachedAccounts.filter((breach) => {
						return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
					});
				})
			)
			.subscribe((breaches) => {
				this.breached_accounts = breaches;
			});

		this.breachedAccountsService.getBreachedAccounts();
	}

	ngOnDestroy() {
	}

	private getParamFromUrl(paramName) {
		return this.route.queryParams.pipe(
			filter((params) => params[paramName]),
			map((param) => param[paramName]),
		);
	}
}
