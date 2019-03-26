import { Component, Input, OnInit } from '@angular/core';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { BrowserAccounts, BrowserAccountsService } from '../../common-services/browser-accounts.service';

@Component({
	selector: 'vtr-installed-browser',
	templateUrl: './installed-browser.component.html',
	styleUrls: ['./installed-browser.component.scss']
})
export class InstalledBrowserComponent implements OnInit {
	@Input() showDetailAction: 'link' | 'expand';
	@Input() installedBrowser: { name: string, image_url: string, accounts?: BrowserAccounts[]};

	public isDetailsExpanded: boolean;
	public decryptedBrowserAccounts: { email?: string, password?: string, image?: string, website?: string }[];

	constructor(private serverCommunicationService: ServerCommunicationService, private browserAccountsService: BrowserAccountsService) {
	}

	ngOnInit() {
		this.decryptedBrowserAccounts = this.browserAccountsService.decryptedBrowserAccounts[this.installedBrowser.name.toLowerCase()];
	}

	toggleDetails() {
		this.isDetailsExpanded = !this.isDetailsExpanded;
	}

	showBrowserAccounts() {
		const getAccountsPromise = this.browserAccountsService.getDecryptedBrowserAccounts(this.installedBrowser.name.toLowerCase());
		getAccountsPromise.then((browserAccounts) => {
			this.decryptedBrowserAccounts = browserAccounts;
		});
	}

}
