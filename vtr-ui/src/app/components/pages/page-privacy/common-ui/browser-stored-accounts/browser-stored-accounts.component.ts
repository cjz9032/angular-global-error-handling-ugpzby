import { Component, Input, OnInit } from '@angular/core';
import { BrowserAccountsService } from '../../common-services/browser-accounts.service';

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() inputData: { showDetailAction: 'expand' | 'link' };

	installedBrowsers$ = this.browserAccountsService.installedBrowsersData$;

	constructor(private browserAccountsService: BrowserAccountsService) {
	}

	ngOnInit() {
		this.browserAccountsService.getInstalledBrowsersDefaultData();
	}

	showPasswordForBrowser(browserName: string) {
		this.browserAccountsService.concatPasswords([browserName]);
	}

	trackByBrowser(index) {
		return index;
	}
}
