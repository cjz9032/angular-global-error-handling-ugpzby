import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BreachedAccountMode } from '../../feature/check-breached-accounts/breached-account/breached-account.component';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { BreachedAccount, BreachedAccountsService } from '../../common/services/breached-accounts.service';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { VantageCommunicationService } from '../../common/services/vantage-communication.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
	readonly breachedAccountMode = BreachedAccountMode;
	browserStoredAccountsData = {showDetailAction: 'link'};

	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	breached_accounts: BreachedAccount[] = [];
	breached_accounts_show: BreachedAccount[];

	isWasScanned = this.emailScannerService.scanNotifier$;
	textForLoader = '';

	onGetBreachedAccountsCompleted$ = this.breachedAccountsService.onGetBreachedAccountsCompleted$;

	constructor(
		private router: Router,
		private breachedAccountsService: BreachedAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private changeDetectorRef: ChangeDetectorRef,
		private emailScannerService: EmailScannerService,
		private vantageCommunicationService: VantageCommunicationService,
	) {
	}

	ngOnInit() {
		this.breachedAccountsService.onGetBreachedAccounts$
			.pipe(takeUntil(instanceDestroyed(this)))
			.subscribe((breachedAccounts) => {
				this.breached_accounts = breachedAccounts.breaches.filter((breach) => {
					return !(breach.hasOwnProperty('isFixed') && breach.isFixed === true);
				});
				this.breached_accounts_show = this.breached_accounts.slice(0, 3);
				this.changeDetectorRef.detectChanges();
			});
	}

	ngOnDestroy() {
	}

	redirectToDetailPage(index: number) {
		this.router.navigate(['privacy', 'breaches'], {queryParams: {openId: index}});
	}

	openFigleafApp() {
		this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:');
	}
}
