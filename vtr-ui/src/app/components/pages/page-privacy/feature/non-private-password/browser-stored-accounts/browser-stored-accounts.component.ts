import { Component, Input, OnInit } from '@angular/core';
import { BrowserAccountsService } from '../../../common/services/browser-accounts.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FeaturesStatuses } from '../../../userDataStatuses';

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

	isShowTryBlock$ = this.userDataGetStateService.userDataStatus$.pipe(
		map((userDataStatus) =>
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.undefined &&
			userDataStatus.nonPrivatePasswordResult !== FeaturesStatuses.error),
		distinctUntilChanged(),
	);


	openAccordion(index) {
		this.openPasswordId = this.openPasswordId === index ? null : index;
	}

	constructor(
		private browserAccountsService: BrowserAccountsService,
		private userDataGetStateService: UserDataGetStateService
	) {
	}

	ngOnInit() {
	}

	trackByBrowser(index) {
		return index;
	}
}
