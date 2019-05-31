import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent {
	breachedAccounts$ = this.breachedAccountsService.onGetBreachedAccounts$
		.pipe(
			map((breachedAccounts) => breachedAccounts.breaches.filter((breach) => {
					return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
				})
			)
		);
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	confirmationPopupName = 'confirmationPopup';

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
	) {
	}

	startVerify() {
		this.commonPopupService.open(this.confirmationPopupName);
		this.emailScannerService.sendConfirmationCode().subscribe();

	}
}
