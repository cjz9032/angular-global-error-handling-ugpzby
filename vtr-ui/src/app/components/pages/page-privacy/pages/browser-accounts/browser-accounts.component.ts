import { Component } from '@angular/core';

@Component({
	// selector: 'app-admin',
	templateUrl: './browser-accounts.component.html',
	styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	browserStoredAccountsData = {showDetailAction: 'expand'};
}
