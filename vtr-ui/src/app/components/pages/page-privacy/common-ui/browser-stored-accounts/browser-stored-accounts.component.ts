import { Component, OnInit, Input } from '@angular/core';
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() inputData: {showDetailAction: 'expand' | 'link'};

	public installedBrowsersNames: Array<string>;
	public installedBrowsers: Array<{name: string, image_url: string, has_stored_accounts: boolean}>;

	// static Data transferred to html
	private chromeDefaultDetail = {
		name: 'Chrome',
		image_url: "/assets/images/privacy-tab/Chrome.png",
		has_stored_accounts: false,
	};
	private firefoxDefaultDetail = {
		name: 'Firefox',
		image_url: "/assets/images/privacy-tab/Chrome.png",
		has_stored_accounts: false,
	};
	private edgeDefaultDetail = {
		name: 'Edge',
		image_url: "/assets/images/privacy-tab/Edge.png",
		has_stored_accounts: false,
	};

	constructor(private serverCommunicationService: ServerCommunicationService) {}

	ngOnInit() {
		this.serverCommunicationService.getInstalledBrowser().then((installedBrowsers: Array<string>) => {
			this.installedBrowsersNames = installedBrowsers;

			this.installedBrowsers = [];
			this.installedBrowsersNames.forEach((browserName) => {
				switch (browserName) {
					case 'chrome':
						this.serverCommunicationService.isChromeHasAccounts().then((hasStoredAccounts) => {
							this.installedBrowsers.push(Object.assign(this.chromeDefaultDetail, {has_stored_accounts: hasStoredAccounts}));
						});
						break;
					case 'firefox':
						this.serverCommunicationService.isFirefoxHasAccounts().then((hasStoredAccounts) => {
							this.installedBrowsers.push(Object.assign(this.firefoxDefaultDetail, {has_stored_accounts: hasStoredAccounts}));
						});
						break;
					case 'edge':
						this.serverCommunicationService.isEdgeHasAccounts().then((hasStoredAccounts) => {
							this.installedBrowsers.push(Object.assign(this.edgeDefaultDetail, {has_stored_accounts: hasStoredAccounts}));
						});
						break;
				}
			});
		});
	}

}
