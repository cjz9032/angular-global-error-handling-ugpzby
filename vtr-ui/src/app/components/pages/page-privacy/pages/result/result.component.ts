import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ServerCommunicationService } from '../../common-services/server-communication.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit{
	public isPopupOpen: boolean;
	public userEmail: string;
	public breached_accounts: any[];
	public breached_accounts_show: any[];
	// static Data for html
	public browserStoredAccountsData = { showDetailAction: 'link'};

	public scoreParameters = { // TODO just mock, add logic
		fixedBreaches: 12,
		unfixedBreaches: 3,
		fixedStorages: 3,
		unfixedStorages: 3,
		monitoringEnabled: false,
		trackingEnabled: false
	};

	constructor(private _location: Location, private serverCommunicationService: ServerCommunicationService) {
		this.isPopupOpen = false;
	}

	ngOnInit() {
		this.breached_accounts = this.serverCommunicationService.breachedAccounts;
		this.breached_accounts_show = this.breached_accounts.slice(0, 3);
		this.userEmail = this.serverCommunicationService.userEmail;
		this.serverCommunicationService.onGetBreachedAccountsResponse.subscribe(() => {
			this.breached_accounts = this.serverCommunicationService.breachedAccounts;
			this.breached_accounts_show = this.breached_accounts.slice(0, 3);
			this.userEmail = this.serverCommunicationService.userEmail;
		});
	}

	backClicked() {
		this._location.back();
	}

	closePopUp() {
		this.isPopupOpen = false;
	}

	openPopUp() {
		this.isPopupOpen = true;
	}
}
