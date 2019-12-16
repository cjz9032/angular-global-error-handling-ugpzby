import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Features } from '../../../core/components/nav-tabs/nav-tabs.service';
import { InstalledBrowserDataState } from '../services/browser-accounts.service';

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
	@Input() isNonPrivatePasswordWasScanned = false;
	@Input() nonPrivatePasswordCount: number;
	@Output() howToFixClick = new EventEmitter<string>();

	passwordFeatureName = Features.passwords;

	tryProductText = {
		risk: 'The passwords in your browser can be easily accessed and misused by third-party apps, putting your personal information at risk.',
		howToFix: 'We recommend creating unique, strong passwords and storing them in ' +
			'encrypted form. Lenovo Privacy Essentials lets you do this easily.',
		riskAfterInstallFigleaf: 'The passwords in your browser can be easily accessed and misused by third-party apps, putting your personal information at risk',
		howToFixAfterInstallFigleaf: 'We recommend creating unique, strong passwords and storing them in ' +
			'encrypted form. Lenovo Privacy Essentials lets you do this easily.'
	};

	openAccordion(index) {
		this.openPasswordId = this.openPasswordId === index ? null : index;
	}

	trackByBrowser(index) {
		return index;
	}
}
