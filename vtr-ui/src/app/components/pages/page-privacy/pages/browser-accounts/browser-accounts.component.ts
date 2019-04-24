import { Component } from '@angular/core';

@Component({
	// selector: 'app-admin',
	templateUrl: './browser-accounts.component.html',
	styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	browserStoredAccountsData = {showDetailAction: 'expand'};
	commonTexts = {
		title: 'Non-private passwords',
		text: 'Web browsers can store your emails and passwords for your favorite sites so you can log in quickly. But browsers don’t always keep your credentials private from everyone.'
	};
}
