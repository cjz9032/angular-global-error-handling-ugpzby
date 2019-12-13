import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, startWith, take, takeUntil } from 'rxjs/operators';
import { BreachedAccountsService } from '../../feature/check-breached-accounts/services/breached-accounts.service';
import { EmailVerifyService } from '../../feature/check-breached-accounts/services/email-verify.service';
import { CommonPopupService } from '../../core/services/popups/common-popup.service';
import { VantageCommunicationService } from '../../core/services/vantage-communication.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { BreachedAccountsFacadeService } from './breached-accounts-facade.service';
import { combineLatest } from 'rxjs';
import { Features } from '../../core/components/nav-tabs/nav-tabs.service';
import { CommonService } from '../../../../../services/common/common.service';
import { NetworkStatus } from '../../../../../enums/network-status.enum';

@Component({
	// selector: 'app-admin',
	templateUrl: './breached-accounts.component.html',
	styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent implements OnInit, OnDestroy {
	breachedFeatureName = Features.breaches;
	isOnline = this.commonService.isOnline;

	breachedAccounts$ = this.breachedAccountsFacadeService.breachedAccounts$;
	isShowVerifyBlock$ = this.breachedAccountsFacadeService.isShowVerifyBlock$;
	isFigleafReadyForCommunication$ = this.breachedAccountsFacadeService.isFigleafReadyForCommunication$;
	isShowExitPitch$ = this.breachedAccountsFacadeService.isShowExitPitch$;
	isUserAuthorized$ = this.breachedAccountsFacadeService.isUserAuthorized$;
	breachedAccountsCount$ = this.breachedAccountsFacadeService.breachedAccountsCount$;
	userEmail$ = this.breachedAccountsFacadeService.userEmail$;
	breachedAccountWasScanned$ = this.breachedAccountsFacadeService.breachedAccountWasScanned$;
	isShowEmailScanner = this.breachedAccountsFacadeService.isShowEmailScanner$;
	isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$ = this.breachedAccountsFacadeService.isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$;
	scanCounter$ = this.breachedAccountsFacadeService.scanCounter$;
	isShowBreachedAccount$ = this.breachedAccountsFacadeService.isShowBreachedAccount$;

	scanCounterLimit = this.breachedAccountsFacadeService.scanCounterLimit;
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
		private emailScannerService: EmailVerifyService,
		private commonPopupService: CommonPopupService,
		private vantageCommunicationService: VantageCommunicationService,
		private breachedAccountsFacadeService: BreachedAccountsFacadeService,
		private commonService: CommonService
	) {
	}

	ngOnInit() {
		this.breachedAccountsService.getNewBreachedAccounts();

		combineLatest([
			this.userEmail$,
			this.emailScannerService.loading$.pipe(startWith(false))
		]).pipe(
			filter(([_, isLoad]) => !isLoad),
			takeUntil(instanceDestroyed(this))
		).subscribe(([userEmail]) => {
			this.updateTextForHeader(userEmail);
		});

		this.checkOnline();
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

	private checkOnline() {
		this.commonService.notification.pipe(
			filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
			map((notification) => notification.payload),
			takeUntil(instanceDestroyed(this))
		).subscribe((payload) => {
			this.isOnline = payload.isOnline;
		});
	}
}
