import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FigleafDashboard } from '../../../common/services/figleaf-overview.service';

@Component({
	selector: 'vtr-browser-account-header',
	templateUrl: './browser-account-header.component.html',
	styleUrls: ['./browser-account-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowserAccountHeaderComponent {
	@Input() isNonPrivatePasswordWasScanned = false;
	@Input() isFigleafReadyForCommunication = false;
	@Input() nonPrivatePasswordCount: number;
	@Input() dashboardData: FigleafDashboard;

	@Output() openFigleafApp = new EventEmitter();

	textForFeatureHeader = {
		title: 'Check for non-private passwords',
		figleafInstalled: 'Lenovo Privacy Essentials by FigLeaf has blocked trackers on sites within the green bubble below, keeping you private ' +
			'while you do the things you love online.',
		figleafUninstalled: 'If you store passwords for your bank accounts or social media profiles in your web browser, ' +
			'you risk sharing this private information unintentionally with apps and extensions on your PC.',
	};

	isNoneBreachedAndFigleafReadyState() {
		return this.isNonPrivatePasswordWasScanned &&
			this.isFigleafReadyForCommunication &&
			this.nonPrivatePasswordCount === 0;
	}
}
