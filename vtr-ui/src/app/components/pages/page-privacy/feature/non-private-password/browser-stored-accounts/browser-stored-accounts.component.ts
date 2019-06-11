import { Component, Input, OnInit } from '@angular/core';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() openPasswordId: number;
	@Input() inputData: { showDetailAction: 'expand' | 'link' };

	installedBrowsers$ = this.browserAccountsService.installedBrowsersData$;
	tryProductText = {
		risk: 'People often reuse the same password for many websites. This leads to multiple account breaches if the password exposed.',
		howToFix: 'Avoid reusing and storing your passwords in your browsers. Create strong, unique passwords for every account with Lenovo Privacy by FigLeaf and store them in encrypted form on your PC.'
	};

	openAccordion(index) {
		this.openPasswordId = this.openPasswordId === index ? null : index;
	}

	constructor(private browserAccountsService: BrowserAccountsService) {
	}

	ngOnInit() {
	}

	trackByBrowser(index) {
		return index;
	}
}
