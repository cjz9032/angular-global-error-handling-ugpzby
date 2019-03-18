import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountsStoredByFigleaf, FigleafAccountsService } from '../../common-services/figleaf-accounts.service';

@Component({
	// selector: 'app-admin',
	templateUrl: './installed.component.html',
	styleUrls: ['./installed.component.scss', './privacy-dashboard.component.scss']
})
export class InstalledComponent implements OnInit {
	accountsStoredByFigleaf: AccountsStoredByFigleaf[];
	scoreParameters = { // TODO just mock, add logic
		fixedBreaches: 12,
		unfixedBreaches: 0,
		fixedStorages: 3,
		unfixedStorages: 1,
		monitoringEnabled: true,
		trackingEnabled: true
	};
	// static Data for html
	browserStoredAccountsData = {showDetailAction: 'link'};
	error: string;

	constructor(private figleafAccountsService: FigleafAccountsService, private _location: Location) {
	}

	ngOnInit() {
		this.figleafAccountsService.getAccountsStoredByFigleaf().subscribe(
			(value => this.accountsStoredByFigleaf = value.payload.figleaf_accounts),
			(error => this.error = error)
		);
	}

	backClicked() {
		this._location.back();
	}
}
