import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InstalledBrowser } from '../../../../common/services/browser-accounts.service';
import { CommunicationWithFigleafService } from '../../../../utils/communication-with-figleaf/communication-with-figleaf.service';

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
	@Output() showPasswordForBrowser$ = new EventEmitter<string>();

	tryProductText = {
		title: 'Keep all passwords private with Lenovo Privacy',
		text: 'Create masked emails and unique, strong passwords for each of your favorite sites.' +
			' Lenovo Privacy by FigLeaf remembers everything and logs you in automatically. Start your 14-day free trial. No credit card required',
		buttonText: 'Try Lenovo Privacy',
		link: {
			text: 'Learn more',
			url: '/#/privacy/landing'
		},
	};

	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	constructor(private communicationWithFigleafService: CommunicationWithFigleafService) {
	}

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
