import { Component, OnInit, Input } from '@angular/core';
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
	selector: 'vtr-browser-accounts-block',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() inputData?: {title: string, showDetailAction: 'expand' | 'link'};

	public installedBrowsersNames: Array<string>;
	public installedBrowsers: Array<object>;

	private chromeDefaultDetail = {
		name: 'Chrome',
		image_url: "/assets/images/privacy-tab/Chrome.png",
	};
	private firefoxDefaultDetail = {
		name: 'Firefox',
		image_url: "/assets/images/privacy-tab/Chrome.png",
	};
	private edgeDefaultDetail = {
		name: 'Edge',
		image_url: "/assets/images/privacy-tab/Edge.png",
	};

	constructor(private serverCommunicationService: ServerCommunicationService) {}

	ngOnInit() {
		this.serverCommunicationService.getInstalledBrowser().then((installedBrowsers: Array<string>) => {
			this.installedBrowsersNames = installedBrowsers;

			this.installedBrowsers = [];
			this.installedBrowsersNames.forEach((browserName) => {
				switch (browserName) {
					case 'chrome':
						return this.installedBrowsers.push(this.chromeDefaultDetail);
					case 'firefox':
						return this.installedBrowsers.push(this.firefoxDefaultDetail);
					case 'edge':
						return this.installedBrowsers.push(this.edgeDefaultDetail);
				}
			})
		});
	}

}
