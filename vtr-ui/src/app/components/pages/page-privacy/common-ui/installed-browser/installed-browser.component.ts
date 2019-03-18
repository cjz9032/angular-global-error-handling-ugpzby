import { Component, Input, OnInit } from '@angular/core';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { BrowserAccountsService } from '../../common-services/browser-accounts.service';

@Component({
	selector: 'vtr-installed-browser',
	templateUrl: './installed-browser.component.html',
	styleUrls: ['./installed-browser.component.scss']
})
export class InstalledBrowserComponent implements OnInit {
	@Input() showDetailAction: 'link' | 'expand';
	@Input() installedBrowser: { name: string, image_url: string, has_stored_accounts: boolean };

	public isDetailsExpanded: boolean;
	public browserAccounts: { email?: string, password?: string, image?: string };

	constructor(private serverCommunicationService: ServerCommunicationService, private browserAccountsService: BrowserAccountsService) {
	}

	ngOnInit() {
	}

	toggleDetails() {
		this.isDetailsExpanded = !this.isDetailsExpanded;
	}

	showBrowserAccounts() {
		let getAccountsPromise;
		switch (this.installedBrowser.name) { // TODO refactor after Api structure is ready
			case 'Chrome':
				getAccountsPromise = this.browserAccountsService.getAccountsChrome();
				break;
			case 'Firefox':
				getAccountsPromise = this.browserAccountsService.getAccountsFirefox();
				break;
			case 'Edge':
				getAccountsPromise = this.browserAccountsService.getAccountsEdge();
				break;
		}
		getAccountsPromise.then((browserAccounts) => {
			this.browserAccounts = browserAccounts;
		});
	}

}
