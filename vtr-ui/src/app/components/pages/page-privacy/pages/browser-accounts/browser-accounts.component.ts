import { Component } from '@angular/core';

@Component({
	// selector: 'app-admin',
	templateUrl: './browser-accounts.component.html',
	styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	browserStoredAccountsData = {showDetailAction: 'expand'};
	commonTexts = {
		title: 'Easy accesible accounts',
		text: 'Major web browsers let you store your usernames and passwords for your favorite sites, so you can log in quickly. But these passwords are usually not well encrypted, making your accounts vulnerable to hacking.'
	};
}
