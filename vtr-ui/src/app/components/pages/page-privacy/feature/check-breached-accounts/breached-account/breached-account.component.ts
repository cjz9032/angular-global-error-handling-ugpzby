import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BreachedAccount } from '../services/breached-accounts.service';

@Component({
	selector: 'vtr-breached-account',
	templateUrl: './breached-account.component.html',
	styleUrls: ['./breached-account.component.scss']
})
export class BreachedAccountComponent implements AfterViewInit {
	@Input() set breachedAccounts(breachedAccounts: BreachedAccount[]) {
		const {breachedAccountsForShow, otherBreaches, unverifyBreaches} = this.getBreachedAccountsForDisplay(breachedAccounts);
		this.breachedAccountsForShow = breachedAccountsForShow;
		this.otherBreaches = otherBreaches;
		this.unverifyBreaches = unverifyBreaches;
	}
	@Input() openId = null;
	@Input() isUserAuthorized = false;
	@Input() isFigleafReadyForCommunication = false;
	@Output() openFigleaf = new EventEmitter<string>();

	breachedAccountsForShow: BreachedAccount[] = [];
	otherBreaches: BreachedAccount[] = [];
	unverifyBreaches: BreachedAccount[] = [];

	tryProductText = {
		risk: 'With your email and passwords exposed, others have access to your personal information, which could lead to identity theft and financial fraud.',
		howToFix: 'We recommend you change your passwords for these accounts and make each one unique. Lenovo Privacy Essentials by FigLeaf can do it all for you.',
		riskAfterInstallFigleaf: 'With your email and passwords exposed, others have access to your personal information, which could lead to identity theft and financial fraud.',
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

	trackByBreachedAccount(index) {
		return index;
	}

	private getBreachedAccountsForDisplay(breachedAccounts: BreachedAccount[]) {
		const breachedAccountsForShow = breachedAccounts.filter(x => x.domain !== 'n/a' && x.isEmailConfirmed);
		const otherBreaches = breachedAccounts.filter(x => x.domain === 'n/a' && x.isEmailConfirmed);
		const unverifyBreaches = breachedAccounts.filter(x => !x.isEmailConfirmed);

		if (otherBreaches.length > 0) {
			breachedAccountsForShow.push({
				...otherBreaches[0],
				hasPassword: otherBreaches.findIndex((breachedAccount) => breachedAccount.hasPassword) > -1,
				hasEmail: otherBreaches.findIndex((breachedAccount) => breachedAccount.hasEmail) > -1,
			});
		}

		return {breachedAccountsForShow, otherBreaches, unverifyBreaches};
	}
}
