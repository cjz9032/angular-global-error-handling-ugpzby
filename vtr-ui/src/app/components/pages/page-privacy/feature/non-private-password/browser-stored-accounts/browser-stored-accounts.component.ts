import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InstalledBrowserDataState } from '../../../common/services/browser-accounts.service';

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent {
	@Input() installedBrowsers: InstalledBrowserDataState;
	@Input() isFigleafInstalled = false;
	@Input() openPasswordId: number;
	@Input() inputData: { showDetailAction: 'expand' | 'link' };
	@Output() howToFixClick = new EventEmitter<string>();

	openAccordion(index) {
		this.openPasswordId = this.openPasswordId === index ? null : index;
	}

	trackByBrowser(index) {
		return index;
	}
}
