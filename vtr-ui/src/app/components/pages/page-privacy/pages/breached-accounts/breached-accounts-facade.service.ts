import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { FeaturesStatuses } from '../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { AccessTokenService } from '../../common/services/access-token.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { SafeStorageService } from '../../common/services/safe-storage.service';
import { AppStatusesService } from '../../common/services/app-statuses/app-statuses.service';

@Injectable({
	providedIn: 'root'
})
export class BreachedAccountsFacadeService {
	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	breachedAccounts$ = this.breachedAccountsService.onGetBreachedAccounts$
		.pipe(
			filter((breachedAccounts) => breachedAccounts.error === null),
			map((breachedAccounts) => breachedAccounts.breaches.filter((breach) => {
					return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
				})
			)
		);
	isUserAuthorized$ = this.accessTokenService.accessTokenIsExist$;
	emailWasScanned$ = this.appStatusesService.globalStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.undefined &&
			userDataStatus.breachedAccountsResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);
	breachedAccountsCount$ = this.countNumberOfIssuesService.breachedAccountsCount;

	userEmail$ = this.emailScannerService.userEmail$.pipe(
		startWith(this.safeStorageService.getEmail()),
		filter(Boolean),
	);

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private breachedAccountsService: BreachedAccountsService,
		private accessTokenService: AccessTokenService,
		private appStatusesService: AppStatusesService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private emailScannerService: EmailScannerService,
		private safeStorageService: SafeStorageService
	) {
	}

	isUndefinedWithoutFigleafState$ = combineLatest([
		this.isFigleafReadyForCommunication$,
		this.breachedAccounts$,
	]).pipe(
		map(([isFigleafReadyForCommunication, breachedAccounts]) =>
			!isFigleafReadyForCommunication && !breachedAccounts.length),
		startWith(true)
	);

	isBreachedFoundAndUserNotAuthorizedWithoutFigleaf$ = combineLatest([
		this.emailWasScanned$,
		this.breachedAccountsCount$,
		this.isUserAuthorized$,
		this.isFigleafReadyForCommunication$
	]).pipe(
		map(([emailWasScanned, breachedAccountsCount, isUserAuthorized, isFigleafReadyForCommunication]) => (
			emailWasScanned && breachedAccountsCount && !isUserAuthorized && !isFigleafReadyForCommunication
		)),
	);
}
