import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
    // selector: 'app-admin',
    templateUrl: './browser-accounts.component.html',
    styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	// static Data for html
	public browserStoredAccountsData = {showDetailAction: 'expand', showBanner: true};

    constructor(private _location: Location) {
    }

    backClicked() {
        this._location.back();
    }
}
