import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { FeaturesStatuses } from '../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { AccessTokenService } from '../../common/services/access-token.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { SafeStorageService } from '../../common/services/safe-storage.service';
import { AppStatusesService } from '../../common/services/app-statuses/app-statuses.service';
import { ScanCounterService } from '../../common/services/scan-counter.service';

@Injectable({
	providedIn: 'root'
})
export class BreachedAccountsFacadeService {
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	isFigleafInExit$ = this.communicationWithFigleafService.isFigleafInExit$;
	breachedAccounts$ = this.breachedAccountsService.onGetBreachedAccounts$
		.pipe(
			debounceTime(100),
			filter((breachedAccounts) => breachedAccounts.error === null),
			map((breachedAccounts) => breachedAccounts.breaches.filter((breach) => {
					return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
				})
			),
			shareReplay(1)
		);
	isAccountVerify$ = this.breachedAccountsService.onGetBreachedAccounts$
		.pipe(
			debounceTime(100),
			filter((breachedAccounts) => breachedAccounts.error === null && !breachedAccounts.reset),
			map((breachedAccounts) => breachedAccounts.breaches.filter((breach) => {
					return !(breach.hasOwnProperty('isEmailConfirmed') && breach.isEmailConfirmed === false);
				})
			),
			map((breachedAccounts) => breachedAccounts.length > 0)
		);
	isUserAuthorized$ = this.accessTokenService.accessTokenIsExist$;
	breachedAccountWasScanned$ = this.appStatusesService.globalStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.undefined &&
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);
	breachedAccountsCount$ = this.countNumberOfIssuesService.breachedAccountsCount;

	userEmail$ = this.emailScannerService.userEmail$;

	scanCounter$ = this.scanCounterService.getScanCounter();

	isShowExitPitch$ = this.communicationWithFigleafService.isFigleafInExit$;

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private breachedAccountsService: BreachedAccountsService,
		private accessTokenService: AccessTokenService,
		private appStatusesService: AppStatusesService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private emailScannerService: EmailScannerService,
		private safeStorageService: SafeStorageService,
		private scanCounterService: ScanCounterService
	) {
	}

	isShowBreachedAccount$ = combineLatest([
		this.isAccountVerify$,
		this.isFigleafReadyForCommunication$,
		this.isUserAuthorized$,
		this.breachedAccounts$
	]).pipe(
		map(([isAccountVerify, isFigleafReadyForCommunication, isUserAuthorized, breachedAccounts]) => {
			return (isAccountVerify && isFigleafReadyForCommunication) ||
				(isUserAuthorized && !isFigleafReadyForCommunication) && breachedAccounts.length;
		})
	);

	isShowEmailScanner$ = combineLatest([
		this.isFigleafReadyForCommunication$,
		this.isFigleafInExit$,
		this.breachedAccounts$,
	]).pipe(
		map(([isFigleafReadyForCommunication, isFigleafInExit, breachedAccounts]) =>
			!isFigleafReadyForCommunication && !isFigleafInExit && !breachedAccounts.length),
		startWith(true)
	);

	isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$ = combineLatest([
		this.breachedAccountWasScanned$,
		this.breachedAccountsCount$,
		this.isUserAuthorized$,
		this.isFigleafReadyForCommunication$,
		this.isFigleafInExit$,
	]).pipe(
		map(([breachedAccountWereScanned, breachedAccountsCount, isUserAuthorized, isFigleafReadyForCommunication, isFigleafInExit]) => (
			breachedAccountWereScanned && breachedAccountsCount && !isUserAuthorized && !isFigleafReadyForCommunication && !isFigleafInExit
		)),
	);

	isShowVerifyBlock$ = combineLatest([
		this.breachedAccountWasScanned$,
		this.isAccountVerify$,
		this.breachedAccountsCount$,
		this.isFigleafReadyForCommunication$,
		this.isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$
	]).pipe(
		debounceTime(200),
		map(([
				 breachedAccountWereScanned, isAccountVerify, breachedAccountsCount,
				 isFigleafReadyForCommunication, isBreachedFoundAndUserNotAuthorizedWithoutFigleaf
			 ]) => (
			(breachedAccountWereScanned && !isAccountVerify && isFigleafReadyForCommunication && breachedAccountsCount > 0) || isBreachedFoundAndUserNotAuthorizedWithoutFigleaf
		)),
		shareReplay(1)
	);
}
