import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BreachedAccount } from '../../../common/services/breached-accounts.service';

@Component({
	selector: 'vtr-breached-account',
	templateUrl: './breached-account.component.html',
	styleUrls: ['./breached-account.component.scss']
})
export class BreachedAccountComponent implements AfterViewInit {
	@Input() set breachedAccounts(breachedAccounts: BreachedAccount[]) {
		const {breachedAccountsForShow, otherBreaches} = this.getBreachedAccountsForDisplay(breachedAccounts);
		this.breachedAccountsForShow = breachedAccountsForShow;
		this.otherBreaches = otherBreaches;
	}
	@Input() openId = null;
	@Input() isUserAuthorized = false;
	@Input() isFigleafReadyForCommunication = false;
	@Output() verifyClick = new EventEmitter<boolean>();
	@Output() openFigleaf = new EventEmitter<string>();

	breachedAccountsForShow: BreachedAccount[] = [];
	otherBreaches: BreachedAccount[] = [];

	tryProductText = {
		risk: 'When your accounts are breached, people you don’t know can access and use your private information.',
		howToFix: 'You should change the passwords for your breached accounts. Try Lenovo Privacy Essentials by FigLeaf to fix breaches and help prevent them in the future.',
		riskAfterInstallFigleaf: 'When your accounts are breached, people you don’t know can access and use your private information.',
		howToFixAfterInstallFigleaf: 'You should change passwords for breached accounts. Open Lenovo Privacy Essentials by FigLeaf and follow the recommendations.'
	};

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

	openFigleafEmit(link: string) {
		this.openFigleaf.emit(link);
	}

	verifyClickEmit() {
		this.verifyClick.emit(true);
	}

	trackByBreachedAccount(index) {
		return index;
	}

	private getBreachedAccountsForDisplay(breachedAccounts: BreachedAccount[]) {
		const breachedAccountsForShow = breachedAccounts.filter(x => x.domain !== 'n/a');
		const otherBreaches = breachedAccounts.filter(x => x.domain === 'n/a');

		breachedAccountsForShow.push({
			...otherBreaches[0],
			hasPassword: otherBreaches.findIndex((breachedAccount) => breachedAccount.hasPassword) > -1,
			hasEmail: otherBreaches.findIndex((breachedAccount) => breachedAccount.hasEmail) > -1,
		});

		return {breachedAccountsForShow, otherBreaches};
	}
}
