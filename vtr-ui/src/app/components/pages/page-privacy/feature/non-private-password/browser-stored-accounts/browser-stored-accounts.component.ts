import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit {
	@Input() openPasswordId: number;
	@Input() inputData: { showDetailAction: 'expand' | 'link' };
	@Output() howToFixClick = new EventEmitter<string>();

	installedBrowsers$ = this.browserAccountsService.installedBrowsersData$;
	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	openAccordion(index) {
		this.openPasswordId = this.openPasswordId === index ? null : index;
	}

	constructor(
		private browserAccountsService: BrowserAccountsService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
	}

	ngOnInit() {
	}

	trackByBrowser(index) {
		return index;
	}
}
