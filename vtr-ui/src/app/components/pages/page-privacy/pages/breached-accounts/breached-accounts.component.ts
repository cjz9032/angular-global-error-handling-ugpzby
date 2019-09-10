import { Component, OnDestroy, OnInit } from '@angular/core';
import { delayWhen, filter, first, skip, startWith, take, takeUntil } from 'rxjs/operators';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { BreachedAccountsFacadeService } from './breached-accounts-facade.service';
import { combineLatest } from 'rxjs';
import { Features } from '../../common/components/nav-tabs/nav-tabs.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent implements OnInit, OnDestroy {
	breachedFeatureName = Features.breaches;
	breachedAccounts$ = this.breachedAccountsFacadeService.breachedAccounts$;
	isAccountVerify$ = this.breachedAccountsFacadeService.isAccountVerify$;
	isShowVerifyBlock$ = this.breachedAccountsFacadeService.isShowVerifyBlock$;
	isFigleafReadyForCommunication$ = this.breachedAccountsFacadeService.isFigleafReadyForCommunication$;
	isUserAuthorized$ = this.breachedAccountsFacadeService.isUserAuthorized$;
	breachedAccountsCount$ = this.breachedAccountsFacadeService.breachedAccountsCount$;
	userEmail$ = this.breachedAccountsFacadeService.userEmail$;
	breachedAccountWasScanned$ = this.breachedAccountsFacadeService.breachedAccountWasScanned$;
	isUndefinedWithoutFigleafState$ = this.breachedAccountsFacadeService.isUndefinedWithoutFigleafState$;
	isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$ = this.breachedAccountsFacadeService.isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$;
	scanCounter$ = this.breachedAccountsFacadeService.scanCounter$;

	textForFeatureHeader = {
		title: 'Check email for breaches',
		figleafTitle: 'Lenovo Privacy Essentials by FigLeaf watches out for breaches',
		figleafInstalled: 'If your personal information shows up in one, you’ll be notified right away.',
		figleafUninstalled: 'Find out if your private information is being exposed. We will check the dark web and every known data breach. Your full email will be encrypted and won’t be visible to anyone except you.',
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
		this.breachedAccountsService.getNewBreachedAccounts();

		combineLatest([
			this.userEmail$,
			this.emailScannerService.loadingStatusChanged$.pipe(startWith(false))
		]).pipe(
			filter(([_, isLoad]) => !isLoad),
			takeUntil(instanceDestroyed(this))
		).subscribe(([userEmail]) => {
			this.updateTextForHeader(userEmail);
		});
	}

	ngOnDestroy() {
	}

	startVerify() {
		this.isFigleafReadyForCommunication$.pipe(take(1)).subscribe((isFigleafReadyForCommunication) => {
			isFigleafReadyForCommunication ? this.openFigleafApp() : this.emailScannerService.sendConfirmationCode().subscribe();
		});
	}

	openFigleafApp() {
		this.openFigleafByUrl('lenovoprivacy:');
	}

	openFigleafByUrl(link) {
		link ? this.vantageCommunicationService.openFigleafByUrl(link) : this.openFigleafApp();
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
