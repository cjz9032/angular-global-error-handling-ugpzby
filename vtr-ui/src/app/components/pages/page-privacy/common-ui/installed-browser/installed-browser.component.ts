import { Component, Input, OnInit } from '@angular/core';
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
	selector: 'vtr-installed-browser',
	templateUrl: './installed-browser.component.html',
	styleUrls: ['./installed-browser.component.scss']
})
export class InstalledBrowserComponent implements OnInit {
	@Input() showDetailAction: 'link' | 'expand';
	@Input() installedBrowser: object;

	public isDetailsExpanded: boolean;
	public browserAccounts;

	constructor(private serverCommunicationService: ServerCommunicationService) {
	}

	ngOnInit() {
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
