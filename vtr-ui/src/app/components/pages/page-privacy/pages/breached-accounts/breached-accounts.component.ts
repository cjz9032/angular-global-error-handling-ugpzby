import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BreachedAccount, BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent implements OnInit, OnDestroy {
	breached_accounts: BreachedAccount[];
	openBreachedId$ = this.getParamFromUrl('openId').pipe(map((val) => Number(val)));
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	confirmationPopupName = 'confirmationPopup';

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.breachedAccountsService.onGetBreachedAccounts$
			.pipe(
				takeUntil(instanceDestroyed(this)),
				map((breachedAccounts) => {
					return breachedAccounts.breaches.filter((breach) => {
						return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
					});
				})
			)
			.subscribe((breaches) => {
				this.breached_accounts = breaches;
			});
	}

	ngOnDestroy() {
	}

	startVerify() {
		this.commonPopupService.open(this.confirmationPopupName);
		this.emailScannerService.sendConfirmationCode().subscribe();

	}

	private getParamFromUrl(paramName) {
		return this.route.queryParams.pipe(
			filter((params) => params[paramName]),
			map((param) => param[paramName]),
		);
	}
}
