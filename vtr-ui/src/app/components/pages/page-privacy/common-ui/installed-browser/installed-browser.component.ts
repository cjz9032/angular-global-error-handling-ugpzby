import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InstalledBrowser } from '../../common-services/browser-accounts.service';

@Component({
	selector: 'vtr-installed-browser',
	templateUrl: './installed-browser.component.html',
	styleUrls: ['./installed-browser.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstalledBrowserComponent {
	@Input() showDetailAction: 'link' | 'expand';
	@Input() installedBrowser: InstalledBrowser;

	@Output() showPasswordForBrowser$ = new EventEmitter<string>();

	isDetailsExpanded = false;

	toggleDetails() {
		this.isDetailsExpanded = !this.isDetailsExpanded;
	}

	showBrowserPasswords() {
		this.showPasswordForBrowser$.emit(this.installedBrowser.name);
	}

	trackAccountsById(index) {
		return index;
	}

}
