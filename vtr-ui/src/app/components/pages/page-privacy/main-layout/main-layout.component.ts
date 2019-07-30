import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationWithFigleafService } from '../utils/communication-with-figleaf/communication-with-figleaf.service';
import { RouterChangeHandlerService } from '../common/services/router-change-handler.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../utils/custom-rxjs-operators/instance-destroyed';
import { RoutersName } from '../privacy-routing-name';
import { FigleafOverviewService } from '../common/services/figleaf-overview.service';
import { UpdateTriggersService } from '../common/services/update-triggers.service';

interface PageSettings {
	showPrivacyScore: boolean;
	showNavigationBlock: boolean;
	showSupportBanner: boolean;
	moveBlockToTop: boolean;
}

const defaultPageSettings: PageSettings = {
	showPrivacyScore: false,
	showNavigationBlock: false,
	showSupportBanner: false,
	moveBlockToTop: false,
};
const featurePageSettings: PageSettings = {
	showPrivacyScore: true,
	showNavigationBlock: true,
	showSupportBanner: true,
	moveBlockToTop: true,
};

@Component({
	// selector: 'vtr-layer',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
	showPrivacyScore = false;
	showNavigationBlock = false;
	showSupportBanner = false;
	moveBlockToTop = false;

	pagesSettings: { [path in RoutersName]: PageSettings } = {
		[RoutersName.LANDING]: defaultPageSettings,
		[RoutersName.ARTICLES]: defaultPageSettings,
		[RoutersName.ARTICLEDETAILS]: defaultPageSettings,
		[RoutersName.TRACKERS]: featurePageSettings,
		[RoutersName.BREACHES]: featurePageSettings,
		[RoutersName.PRIVACY]: featurePageSettings,
		[RoutersName.MAIN]: featurePageSettings,
		[RoutersName.BROWSERACCOUNTS]: featurePageSettings,
	};

	isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	dashboardData$ = this.figleafOverviewService.figleafDashboard$;

	constructor(
		private router: Router,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private routerChangeHandler: RouterChangeHandlerService,
		private figleafOverviewService: FigleafOverviewService,
		private updateTriggersService: UpdateTriggersService,
	) {
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.updateTriggersService.updateFocusedState(true);
	}

	ngOnInit() {
		this.communicationWithFigleafService.connect();
		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe(
				(currentPath) => this.setCurrentRouterPage(currentPath)
			);
	}

	ngOnDestroy() {
		this.communicationWithFigleafService.disconnect();
	}

	setCurrentRouterPage(routerPage: string) {
		this.showPrivacyScore = this.pagesSettings[routerPage].showPrivacyScore;
		this.showNavigationBlock = this.pagesSettings[routerPage].showNavigationBlock;
		this.showSupportBanner = this.pagesSettings[routerPage].showSupportBanner;
		this.moveBlockToTop = this.pagesSettings[routerPage].moveBlockToTop;
	}
}
