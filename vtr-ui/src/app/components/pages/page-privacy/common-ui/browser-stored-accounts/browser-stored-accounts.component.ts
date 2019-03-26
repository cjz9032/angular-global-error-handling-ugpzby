import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
	BrowserAccountsService,
	InstalledBrowser
} from '../../common-services/browser-accounts.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-browser-stored-accounts',
	templateUrl: './browser-stored-accounts.component.html',
	styleUrls: ['./browser-stored-accounts.component.scss']
})
export class BrowserStoredAccountsComponent implements OnInit, OnDestroy {
	@Input() inputData: { showDetailAction: 'expand' | 'link' };

	installedBrowsers: InstalledBrowser[] = [];

	constructor(private browserAccountsService: BrowserAccountsService) {
	}

	ngOnInit() {
		this.browserAccountsService.installedBrowsersData$.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe((installedBrowsers) => {
			this.installedBrowsers = installedBrowsers;
		});
		this.browserAccountsService.getInstalledBrowsersDefaultData();
	}

	ngOnDestroy() {
	}
}
