import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FigleafDashboard } from '../../../core/services/figleaf-overview.service';

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
		title: 'Check for vulnerable passwords',
		figleafInstalled: 'Lenovo Privacy Essentials by FigLeaf has blocked trackers on sites within the green bubble below, keeping you private ' +
			'while you do the things you love online.',
		figleafUninstalled: 'If you store passwords for your bank accounts or social media profiles in your web browser, ' +
			'you risk sharing this private information unintentionally with apps and extensions on your PC.',
		noIssuesTitle: 'No vulnerable passwords found',
		noIssuesDescription: 'You should continue to avoid storing your passwords in your browsers. To be safe, you should only store them in an app built with privacy in mind. '
	};

	textForTooltip = 'Your passwords can be freely accessed by third-party apps. ' +
		'You allowed us to scan your browser, so we found and easily decrypted these' +
		' passwords to show you how other programs can do the same without your knowledge. ' +
		'One big difference — we don\'t store or share your passwords.';

	isNoneBreachedAndFigleafReadyState() {
		return this.isNonPrivatePasswordWasScanned &&
			this.isFigleafReadyForCommunication &&
			this.nonPrivatePasswordCount === 0;
	}
}
