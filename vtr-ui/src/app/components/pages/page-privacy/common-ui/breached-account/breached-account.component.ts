import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BreachedAccount } from '../../common-services/breached-accounts.service';
import { VantageCommunicationService } from '../../common-services/vantage-communication.service';
import { CommunicationWithFigleafService } from '../../communication-with-figleaf/communication-with-figleaf.service';

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
	@Input() openId = null;
	@Output() detailClick = new EventEmitter<number>();

	isFigleafReadyForCommunication = false;

	tryProductText = {
		title: 'Fix & monitor breaches with Lenovo Privacy',
		text: 'Fix your breached accounts with ease by changing your passwords and mask emails.' +
			' If any of your accounts stored in Lenovo Privacy by FigLeaf are part of a breach, you’ll know about it. Start 14-day free trial. No credit card required.',
		buttonText: 'Try Lenovo Privacy',
		link: {
			text: 'Learn more',
			url: '/#/privacy/landing'
		},
	};

	readonly breachedAccountMode = BreachedAccountMode;

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private vantageCommunicationService: VantageCommunicationService) {
	}

	ngOnInit() {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReady) => {
			this.isFigleafReadyForCommunication = isFigleafReady;
		});
	}

	transformDomain(domain) {
		if (domain === 'n/a') {
			return 'unknown website';
		}
		return domain;
	}

	openAccordion(index) {
		this.openId = this.openId === index ? null : index;
	}

	openFigleaf(link) {
		this.vantageCommunicationService.openFigleafByUrl(link);
	}

	detailClickEmit(i) {
		// TODO replace with real ID
		this.detailClick.emit(i);
	}
}
