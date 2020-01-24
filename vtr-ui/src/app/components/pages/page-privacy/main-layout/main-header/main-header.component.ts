import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { RoutersName } from '../../privacy-routing-name';
import { RouterChangeHandlerService } from '../../core/services/router-change-handler.service';

interface PageSettings {
	title: string;
	backButton: boolean;
	figLeafIcon: boolean;
}

const defaultPageSettings: PageSettings = {
	title: 'Lenovo Privacy Essentials',
	backButton: true,
	figLeafIcon: true,
};

@Component({
	selector: 'vtr-main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
	title = 'Lenovo Privacy Essentials';
	backButton = false;
	figLeafIcon = true;

	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];

	// look on route list
	pagesSettings: { [path in RoutersName]: PageSettings } = {
		[RoutersName.MAIN]: defaultPageSettings,
		privacy: defaultPageSettings,
		trackers: defaultPageSettings,
		breaches: defaultPageSettings,
		'browser-accounts': defaultPageSettings,
		landing: {
			title: 'Lenovo Privacy Essentials by FigLeaf',
			backButton: true,
			figLeafIcon: false
		},
		articles: {
			title: 'Privacy Hub',
			backButton: true,
			figLeafIcon: false
		},
		'article-details': {
			title: 'Privacy Hub',
			backButton: true,
			figLeafIcon: false
		}
	};

	constructor(
		private router: Router,
		private _location: Location,
		public dccService: DccService,
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
