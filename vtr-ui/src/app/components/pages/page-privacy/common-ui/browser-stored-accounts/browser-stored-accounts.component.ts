import { Component, OnInit, Input } from '@angular/core';
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() inputData: {title?: string, showDetailAction: 'expand' | 'link', showBanner?: boolean};

	public installedBrowsersNames: Array<string>;
	public installedBrowsers: Array<object>;
	// static Data transferred to html
	public LightPrivacyBannerData = {
		title: 'Take back control over your data with Lenovo Privacy',
		text: 'A simple comprehensive app that gives YOU back control over your privacy',
	};

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
