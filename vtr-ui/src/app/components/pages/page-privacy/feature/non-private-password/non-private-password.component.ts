import { Component, Input, OnInit } from '@angular/core';
import { FigleafOverviewService } from '../../common/services/figleaf-overview.service';
import { BrowserAccountsService } from '../../common/services/browser-accounts.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FeaturesStatuses } from '../../userDataStatuses';
import { UserDataGetStateService } from '../../common/services/user-data-get-state.service';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { CommonPopupService } from '../../common/services/popups/common-popup.service';
import { CountNumberOfIssuesService } from '../../common/services/count-number-of-issues.service';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'vtr-non-private-password',
	templateUrl: './non-private-password.component.html',
	styleUrls: ['./non-private-password.component.scss']
})
export class NonPrivatePasswordComponent implements OnInit {
	@Input() browserStoredAccountsData: { showDetailAction: 'expand' | 'link' } = {showDetailAction: 'link'};
	installedBrowsers$ = this.browserAccountsService.installedBrowsersData$.pipe(tap((val) => console.log('installedBrowsersData$', val)));

	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	openPasswordId$ = this.getParamFromUrl('openId').pipe(
		map((val) => Number(val)),
	);

	nonPrivatePasswordCount$ = this.countNumberOfIssuesService.nonPrivatePasswordCount;

	removePasswordPopupId = 'removePassword';
	browserName: string;

	isNonPrivatePasswordWasScanned$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.undefined &&
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);

	isShowAccountsStored$ = combineLatest([
		this.isFigleafReadyForCommunication$,
		this.userDataGetStateService.userDataStatus$
	]).pipe(
		map(([isFigleafReadyForCommunication, userDataStatus]) => {
			return userDataStatus.nonPrivatePasswordResult === FeaturesStatuses.undefined &&
				isFigleafReadyForCommunication;
		})
	);

	isBreachedAndFigleafReady$ = combineLatest([
		this.isFigleafReadyForCommunication$,
		this.isNonPrivatePasswordWasScanned$,
		this.nonPrivatePasswordCount$
	]).pipe(
		map(([isFigleafReady, isPasswordWasScanned, passwordCount]) => (
			isFigleafReady && isPasswordWasScanned && passwordCount
		))
	);

	dashboardData$ = this.figleafOverviewService.figleafDashboard$;

	constructor(
		private figleafOverviewService: FigleafOverviewService,
		private browserAccountsService: BrowserAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private vantageCommunicationService: VantageCommunicationService,
		private userDataGetStateService: UserDataGetStateService,
		private commonPopupService: CommonPopupService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private route: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.browserAccountsService.updateBrowsersData();
	}

	openFigleaf() {
		this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:');
	}

	openPopup(browserName) {
		this.browserName = browserName;
		this.commonPopupService.open(this.removePasswordPopupId);
	}

	closePopup(removePasswordPopupId) {
		this.commonPopupService.close(removePasswordPopupId);
	}

	private getParamFromUrl(paramName) {
		return this.route.queryParams.pipe(
			filter((params) => params[paramName]),
			map((param) => param[paramName]),
		);
	}

}
