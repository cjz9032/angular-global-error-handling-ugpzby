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
	public breached_accounts: any[];
	public breached_accounts_show: any[];
	// static Data for html
	public browserStoredAccountsData = { showDetailAction: 'link'};

	constructor(private _location: Location, private serverCommunicationService: ServerCommunicationService) {
		this.isPopupOpen = false;
	}

	ngOnInit() {
		this.breached_accounts = this.serverCommunicationService.breachedAccounts;
		this.breached_accounts_show = this.breached_accounts.slice(0, 3);
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
