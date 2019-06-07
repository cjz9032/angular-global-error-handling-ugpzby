import { Component } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { AccessTokenService } from '../../common/services/access-token.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent {
	breachedAccounts$ = this.breachedAccountsService.onGetBreachedAccounts$
		.pipe(
			filter((breachedAccounts) => breachedAccounts.error === null),
			map((breachedAccounts) => breachedAccounts.breaches.filter((breach) => {
					return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
				})
			)
		);
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	confirmationPopupName = 'confirmationPopup';
	isUserAuthorized$ = this.accessTokenService.accessTokenIsExist$;
	breachedAccountsCount$ = this.countNumberOfIssuesService.breachedAccountsCount;

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
		private accessTokenService: AccessTokenService,
		private countNumberOfIssuesService: CountNumberOfIssuesService
	) {
	}

	startVerify() {
		this.commonPopupService.open(this.confirmationPopupName);
		this.emailScannerService.sendConfirmationCode().subscribe();
	}
}
