import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../shared/services/router-change-handler.service';

// todo delete this
import config from '../../configInfo.json';

interface PageSettings {
	title: string;
	backButton: boolean;
	figLeafIcon: boolean;
}

const defaultPageSettings: PageSettings = {
	title: 'Lenovo Privacy',
	backButton: false,
	figLeafIcon: true,
};

@Component({
	selector: 'vtr-main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {

	title = 'Lenovo Privacy';
	backButton = false;
	figLeafIcon = true;

	// todo delete this
	version = config.appVersion;

	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];

	// look on route list
	pagesSettings: { [pageRoute: string]: PageSettings } = {
		defaultPageSettings: defaultPageSettings,
		privacy: defaultPageSettings,
		scan: defaultPageSettings,
		result: defaultPageSettings,
		trackers: {
			title: 'Am I being tracked?',
			backButton: true,
			figLeafIcon: false
		},
		installed: defaultPageSettings,
		breaches: {
			title: 'Breached accounts',
			backButton: true,
			figLeafIcon: false
		},
		'browser-accounts': {
			title: 'Accounts stored in Browsers',
			backButton: true,
			figLeafIcon: false
		},
		faq: {
			title: 'F.A.Q’s',
			backButton: true,
			figLeafIcon: false
		},
	};

	constructor(
		private router: Router,
		private _location: Location,
		private routerChangeHandler: RouterChangeHandlerService
	) {
	}

	setCurrentRouterPage(routerPage: string) {
		if (this.pagesSettings[routerPage]) {
			this.title = this.pagesSettings[routerPage].title;
			this.backButton = this.pagesSettings[routerPage].backButton;
			this.figLeafIcon = this.pagesSettings[routerPage].figLeafIcon;
		} else {
			this.title = defaultPageSettings.title;
			this.backButton = defaultPageSettings.backButton;
			this.figLeafIcon = defaultPageSettings.figLeafIcon;
		}
	}

	ngOnInit() {
		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this))
			)
			.subscribe(
				(currentPath) => this.setCurrentRouterPage(currentPath)
			);
	}

	ngOnDestroy() {
	}

	backClicked() {
		this._location.back();
	}
}
