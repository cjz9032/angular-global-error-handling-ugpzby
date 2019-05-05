import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../common/services/router-change-handler.service';

import { RoutersName } from '../../privacy-routing-name';

interface PageSettings {
	title: string;
	backButton: boolean;
	showNavigationBlock: boolean;
	figLeafIcon: boolean;
}

const defaultPageSettings: PageSettings = {
	title: 'Lenovo Privacy',
	backButton: false,
	showNavigationBlock: false,
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
	showNavigationBlock = false;

	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];

	// look on route list
	pagesSettings: { [path in RoutersName]: PageSettings } = {
		[RoutersName.MAIN]: defaultPageSettings,
		tips: defaultPageSettings,
		privacy: defaultPageSettings,
		news: defaultPageSettings,
		scan: defaultPageSettings,
		trackers: {
			title: 'Am I being tracked?',
			backButton: true,
			showNavigationBlock: true,
			figLeafIcon: false
		},
		installed: defaultPageSettings,
		breaches: {
			title: 'Breached accounts',
			backButton: true,
			showNavigationBlock: true,
			figLeafIcon: false
		},
		'browser-accounts': {
			title: 'Accounts stored in Browsers',
			backButton: true,
			showNavigationBlock: true,
			figLeafIcon: false
		},
		faq: {
			title: 'F.A.Q’s',
			backButton: true,
			showNavigationBlock: false,
			figLeafIcon: false
		},
		landing: {
			title: 'Lenovo Privacy by FigLeaf',
			backButton: true,
			showNavigationBlock: false,
			figLeafIcon: false
		}
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
			this.showNavigationBlock = this.pagesSettings[routerPage].showNavigationBlock;
		} else {
			this.title = defaultPageSettings.title;
			this.backButton = defaultPageSettings.backButton;
			this.figLeafIcon = defaultPageSettings.figLeafIcon;
			this.showNavigationBlock = defaultPageSettings.showNavigationBlock;
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
