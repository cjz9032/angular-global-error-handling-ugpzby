import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreachedAccount } from '../../../common/services/breached-accounts.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { BreachedAccountService } from './breached-account.service';

export enum BreachedAccountMode {
	FULL = 'FULL',
	PREVIEW = 'PREVIEW'
}

@Component({
	selector: 'vtr-breached-account',
	templateUrl: './breached-account.component.html',
	styleUrls: ['./breached-account.component.scss']
})
export class BreachedAccountComponent implements OnInit, AfterViewInit {
	@Input() mode: BreachedAccountMode = BreachedAccountMode.FULL;
	@Input() set breachedAccounts(breachedAccounts: BreachedAccount[]) {
		const {breachedAccountsForShow, otherBreaches} =
			this.breachedAccountService.createBreachedAccountsForShow(breachedAccounts);
		this.breachedAccountsForShow = breachedAccountsForShow;
		this.otherBreaches = otherBreaches;
	}
	@Input() openId = null;
	@Input() isUserAuthorized: boolean;
	@Output() verifyClick = new EventEmitter<boolean>();

	breachedAccountsForShow: BreachedAccount[] = [];
	otherBreaches: BreachedAccount[] = [];

	isFigleafReadyForCommunication = false;

	tryProductText = {
		risk: 'When your accounts are breached, people you don’t know can access and use your private information.',
		howToFix: 'You should change the passwords for your breached accounts. Try Lenovo Privacy by FigLeaf to fix breaches and help prevent them in the future.',
		riskAfterInstallFigleaf: 'When your accounts are breached, people you don’t know can access and use your private information.',
		howToFixAfterInstallFigleaf: 'You should change passwords for breached accounts. Open Lenovo Privacy Essentials by FigLeaf and follow the recommendations.'
	};

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private vantageCommunicationService: VantageCommunicationService,
		private breachedAccountService: BreachedAccountService) {
	}

	ngOnInit() {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReady) => {
			this.isFigleafReadyForCommunication = isFigleafReady;
		});
	}

	ngAfterViewInit() {
		const el = document.querySelector('.breached-account_open');
		if (this.openId != null && el) {
			const {top} = el.getBoundingClientRect();
			window.scrollTo(0, top, );
		}
	}

	transformDomain(domain) {
		if (domain === 'n/a') {
			return 'Other breach info';
		}
		return domain;
	}

	openAccordion(index) {
		this.openId = this.openId === index ? null : index;
	}

	openFigleaf(link) {
		this.vantageCommunicationService.openFigleafByUrl(link);
	}

	verifyClickEmit() {
		this.verifyClick.emit(true);
	}
}
