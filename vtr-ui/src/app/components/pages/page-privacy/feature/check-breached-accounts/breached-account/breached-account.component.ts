import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit } from '@angular/core';
import { BreachedAccount } from '../../../common/services/breached-accounts.service';
import { VantageCommunicationService } from '../../../common/services/vantage-communication.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { AccessTokenService } from '../../../common/services/access-token.service';

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
	@Input() breachedAccounts: BreachedAccount[];
	@Input() openId = null;
	@Output() detailClick = new EventEmitter<number>();
	@Output() verifyClick = new EventEmitter<boolean>();

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

	isUserAuthorized$ = this.accessTokenService.accessTokenIsExist$;

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private accessTokenService: AccessTokenService,
		private vantageCommunicationService: VantageCommunicationService) {
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

	verifyClickEmit() {
		this.verifyClick.emit(true);
	}
}
