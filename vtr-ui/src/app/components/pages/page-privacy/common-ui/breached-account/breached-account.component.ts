import { Component, Input, OnInit } from '@angular/core';

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
export class BreachedAccountComponent implements OnInit {
	@Input() mode: BreachedAccountMode = BreachedAccountMode.FULL;
	@Input() breachedAccounts: BreachedAccount[];
	readonly breachedAccountMode = BreachedAccountMode;
	openId = null;

	constructor() {
	}

	ngOnInit() {
	}

	open(index) {
		this.openId = this.openId === index ? null : index;
	}

}
