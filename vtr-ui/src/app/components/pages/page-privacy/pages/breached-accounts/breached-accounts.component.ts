import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { AccessTokenService } from '../../common/services/access-token.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { SafeStorageService } from '../../common/services/safe-storage.service';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent implements OnInit {
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
	userEmail$ = this.emailScannerService.userEmail$.pipe(
		startWith(this.safeStorageService.getEmail()),
		filter(Boolean),
	);
	emailWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.undefined &&
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
		private accessTokenService: AccessTokenService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private safeStorageService: SafeStorageService,
		private userDataGetStateService: UserDataGetStateService
	) {
	}

	ngOnInit() {
		this.breachedAccountsService.getBreachedAccounts();
	}

	startVerify() {
		this.commonPopupService.open(this.confirmationPopupName);
		this.emailScannerService.sendConfirmationCode().subscribe();
	}
}
