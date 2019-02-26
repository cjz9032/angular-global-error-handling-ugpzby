import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
    // selector: 'app-admin',
    templateUrl: './breached-accounts.component.html',
    styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent {
	public breached_accounts: Array<object>;
	// static Data transferred to html
	public LightPrivacyBannerData = {
		title: 'Fix breaches and watch for future ones',
        text: 'Get the app that puts you back in control of your privacy'
	};

	constructor(private _location: Location, private serverCommunicationService: ServerCommunicationService) {
	}

	ngOnInit() {
		this.breached_accounts = this.serverCommunicationService.breachedAccounts;
	}

    backClicked() {
        this._location.back();
    }
}
