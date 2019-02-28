import { Component, Input, OnInit } from '@angular/core';
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
	selector: 'vtr-installed-browser',
	templateUrl: './installed-browser.component.html',
	styleUrls: ['./installed-browser.component.scss']
})
export class InstalledBrowserComponent implements OnInit {
	@Input() showDetailAction: 'link' | 'expand';
	@Input() installedBrowser: {name: string, image_url: string, has_stored_accounts: boolean};

	public isDetailsExpanded: boolean;
	public browserAccounts: {email?: string, password?: string, image?: string};

	constructor(private serverCommunicationService: ServerCommunicationService) {
	}

	ngOnInit() {
		switch (this.installedBrowser.name) {
			case 'Chrome':
				this.browserAccounts = this.serverCommunicationService.chromeAccounts;
				break;
			case 'Firefox':
				this.browserAccounts = this.serverCommunicationService.firefoxAccounts;
				break;
			case 'Edge':
				this.browserAccounts = this.serverCommunicationService.edgeAccounts;
				break;
		}
	}

	toggleDetails() {
		this.isDetailsExpanded = !this.isDetailsExpanded;
	}

	showBrowserAccounts() {
		let getAccountsPromise;
		switch (this.installedBrowser.name) {
			case 'Chrome':
				getAccountsPromise = this.serverCommunicationService.getAccountsChrome();
				break;
			case 'Firefox':
				getAccountsPromise = this.serverCommunicationService.getAccountsFirefox();
				break;
			case 'Edge':
				getAccountsPromise = this.serverCommunicationService.getAccountsEdge();
				break;
		}
		getAccountsPromise.then((browserAccounts) => {
			this.browserAccounts = browserAccounts;
		});
	}

}
