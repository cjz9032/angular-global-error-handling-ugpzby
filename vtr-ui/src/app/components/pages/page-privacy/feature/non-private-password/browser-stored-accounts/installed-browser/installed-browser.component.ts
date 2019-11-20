import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InstalledBrowser } from '../../services/browser-accounts.service';
import { DEFAULT_SITES_FAVICON } from '../../../../common/services/data-knowledge.service';

@Component({
	selector: 'vtr-installed-browser',
	templateUrl: './installed-browser.component.html',
	styleUrls: ['./installed-browser.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstalledBrowserComponent {
	@Input() showDetailAction: 'link' | 'expand';
	@Input() installedBrowser: InstalledBrowser;
	@Input() index: number;
	@Input() isDetailsExpanded = false;
	@Input() isFigleafInstalled = false;

	@Output() openAccordion = new EventEmitter<number>();
	@Output() howToFixClick = new EventEmitter<string>();

	defaultIcon = DEFAULT_SITES_FAVICON;

	scrollEnd = 10;

	tryProductText = {
		risk: 'People often reuse the same password for many websites. This leads to multiple account breaches if the password exposed.',
		howToFix: 'Avoid reusing and storing your passwords in your browsers. Create strong, unique passwords for every account with Lenovo Privacy Essentials by FigLeaf and store them in encrypted form on your PC.'
	};

	trackAccountsById(index) {
		return index;
	}

	changeScrollEnd() {
		this.scrollEnd = this.scrollEnd + 10;
	}

}
