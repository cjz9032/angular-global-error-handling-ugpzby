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

	constructor(private _location: Location, private serverCommunicationService: ServerCommunicationService) {
		this.isPopupOpen = false;
	}

	ngOnInit() {
		this.breached_accounts = this.serverCommunicationService.breachedAccounts;
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
