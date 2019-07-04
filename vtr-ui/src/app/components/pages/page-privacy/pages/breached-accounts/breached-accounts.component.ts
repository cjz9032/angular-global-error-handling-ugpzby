import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { BreachedAccountsFacadeService } from './breached-accounts-facade.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent implements OnInit, OnDestroy {
	breachedAccounts$ = this.breachedAccountsFacadeService.breachedAccounts$;
	isFigleafReadyForCommunication$ = this.breachedAccountsFacadeService.isFigleafReadyForCommunication$;
	isUserAuthorized$ = this.breachedAccountsFacadeService.isUserAuthorized$;
	breachedAccountsCount$ = this.breachedAccountsFacadeService.breachedAccountsCount$;
	userEmail$ = this.breachedAccountsFacadeService.userEmail$;
	emailWasScanned$ = this.breachedAccountsFacadeService.emailWasScanned$;
	isUndefinedWithoutFigleafState$ = this.breachedAccountsFacadeService.isUndefinedWithoutFigleafState$;
	isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$ = this.breachedAccountsFacadeService.isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$;

	confirmationPopupName = 'confirmationPopup';
	textForFeatureHeader = {
		title: 'Check email for breaches',
		figleafTitle: 'Lenovo Privacy Essentials monitors your accounts',
		figleafInstalled: 'If there is a data leak, we will immediately notify you.',
		figleafUninstalled: 'Find out if your private information is being exposed. We will check the dark web and every known data breach.',
		noIssuesTitle: 'No breaches found for your email',
		noIssuesDescription: 'Your private information associated with this email address is safe so far.'
	};
	textForTooltip = 'Your private information is not private anymore. You allowed us to do a search, ' +
		'and we found these tied to your email address among compromised records on the internet and the dark web.';

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
		private vantageCommunicationService: VantageCommunicationService,
		private breachedAccountsFacadeService: BreachedAccountsFacadeService
	) {
	}

	ngOnInit() {
		this.breachedAccountsService.getBreachedAccounts();

		this.userEmail$.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe((userEmail) => {
			this.updateTextForHeader(userEmail);
		});

	}

	ngOnDestroy() {
	}

	startVerify() {
		this.commonPopupService.open(this.confirmationPopupName);
		this.emailScannerService.sendConfirmationCode().subscribe();
	}

	openFigleafApp() {
		this.openFigleafByUrl('lenovoprivacy:');
	}

	openFigleafByUrl(link) {
		this.vantageCommunicationService.openFigleafByUrl(link);
	}

	getTextForTooltip(numberOfIssues) {
		const numberOfIssuesText = numberOfIssues === 1 ? 'breached account' : 'breached accounts';
		return `Your private information is not private anymore. You allowed us to do a search, and we found these ` +
			`tied to your email address among compromised records on the internet and the dark web.`;
	}

	private updateTextForHeader(userEmail: string) {
		this.textForFeatureHeader = {
			...this.textForFeatureHeader,
			noIssuesTitle: `No breaches found for ${userEmail}`
		};
	}
}
