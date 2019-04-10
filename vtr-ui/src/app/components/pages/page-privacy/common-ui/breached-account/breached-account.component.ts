import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface BreachedAccount {
	domain: string;
	image: string;
	email: string;
	password: string;
	date: string;
	name: string;
	address: string;
	description: string;
}

export enum BreachedAccountMode {
	FULL = 'FULL',
	PREVIEW = 'PREVIEW'
}

@Component({
	selector: 'vtr-breached-account',
	templateUrl: './breached-account.component.html',
	styleUrls: ['./breached-account.component.scss']
})
export class BreachedAccountComponent {
	@Input() mode: BreachedAccountMode = BreachedAccountMode.FULL;
	@Input() breachedAccounts: BreachedAccount[];
	@Input() openId = null;
	@Output() detailClick = new EventEmitter<number>();

	readonly breachedAccountMode = BreachedAccountMode;
	defaultImage = '/assets/images/privacy-tab/default.png';

	transformDomain(domain) {
		if (domain === 'n/a') {
			return 'unknown website';
		}
		return domain;
	}

	openAccordion(index) {
		this.openId = this.openId === index ? null : index;
	}

	detailClickEmit(i) {
		// TODO replace with real ID
		this.detailClick.emit(i);
	}

}
