import { Component, OnInit, Input } from '@angular/core';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { BrowserAccountsService } from '../../common-services/browser-accounts.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

interface InstalledBrowser {
	name: string;
	image_url: string;
	has_stored_accounts: boolean;
}

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() inputData: { showDetailAction: 'expand' | 'link' };

	installedBrowsers: InstalledBrowser[] = [];

	// static Data transferred to html
	private chromeDefaultDetail = {
		name: 'Chrome',
		image_url: '/assets/images/privacy-tab/Chrome.png',
		has_stored_accounts: false,
	};
	private firefoxDefaultDetail = {
		name: 'Firefox',
		image_url: '/assets/images/privacy-tab/Chrome.png',
		has_stored_accounts: false,
	};
	private edgeDefaultDetail = {
		name: 'Edge',
		image_url: '/assets/images/privacy-tab/Edge.png',
		has_stored_accounts: false,
	};

	constructor(
		private serverCommunicationService: ServerCommunicationService,
		private browserAccountsService: BrowserAccountsService) {
	}

	ngOnInit() {
		const getBrowserData = (browserName) => {
			switch (browserName) {
				case 'chrome':
					return this.browserAccountsService.isChromeHasAccounts().pipe(
						map(hasStoredAccountsResponse => {
							return {
								...this.chromeDefaultDetail,
								has_stored_accounts: hasStoredAccountsResponse.payload.has_accounts
							};
						})
					);
				case 'edge':
					return this.browserAccountsService.isEdgeHasAccounts().pipe(
						map(hasStoredAccountsResponse => {
							return {
								...this.edgeDefaultDetail,
								has_stored_accounts: hasStoredAccountsResponse.payload.has_accounts
							};
						})
					);
				case 'firefox':
					return this.browserAccountsService.isFirefoxHasAccounts().pipe(
						map(hasStoredAccountsResponse => {
							return {
								...this.firefoxDefaultDetail,
								has_stored_accounts: hasStoredAccountsResponse.payload.has_accounts
							};
						})
					);
			}
		};
		this.serverCommunicationService.getInstalledBrowser().pipe(
			switchMap(installedBrowsersResponse => of(...installedBrowsersResponse.payload.installed_browsers)),
			mergeMap((browserName) => getBrowserData(browserName)),
		).subscribe(browserData => {
			this.installedBrowsers.push(browserData);
		});
	}
}
