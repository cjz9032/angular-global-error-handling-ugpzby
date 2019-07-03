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
	@Input() isNonPrivatePasswordWasScanned = false;
	@Input() nonPrivatePasswordCount: number;
	@Output() howToFixClick = new EventEmitter<string>();

	tryProductText = {
		risk: 'People often reuse the same password for many websites. This leads to multiple account breaches if the password exposed.',
		howToFix: 'Avoid reusing and storing your passwords in your browsers. Create strong, unique passwords for every account with Lenovo Privacy Essentials by FigLeaf and store them in encrypted form on your PC.',
		riskAfterInstallFigleaf: 'People often reuse the same password for many websites. This leads to multiple account breaches if the password exposed.',
		howToFixAfterInstallFigleaf: 'Avoid reusing and storing your passwords in browsers. ' +
			'If you need a strong one, create it with Lenovo Privacy Essentials by FigLeaf and store it on your PC, completely encrypted.'
	};

	openAccordion(index) {
		this.openPasswordId = this.openPasswordId === index ? null : index;
	}

	trackByBrowser(index) {
		return index;
	}
}
