import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationHistoryService } from '../common/services/location-history.service';
import { CommonPopupService } from '../common/services/popups/common-popup.service';
import { ChoseBrowserService } from '../common/services/chose-browser.service';
import { Router } from '@angular/router';
import { CommunicationWithFigleafService } from '../utils/communication-with-figleaf/communication-with-figleaf.service';
import { TrackingMapService } from '../feature/tracking-map/services/tracking-map.service';
import { TaskActionService } from '../common/services/task-action.service';
import { RouterChangeHandlerService } from '../common/services/router-change-handler.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../utils/custom-rxjs-operators/instance-destroyed';
import { RoutersName } from '../privacy-routing-name';

interface PageSettings {
	showPrivacyScore: boolean;
	showNavigationBlock: boolean;
	showSupportBanner: boolean;
}

const defaultPageSettings: PageSettings = {
	showPrivacyScore: false,
	showNavigationBlock: false,
	showSupportBanner: false,
};

@Component({
	// selector: 'vtr-layer',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
	choseBrowserPopupId = 'choseBrowserPopup';
	browserList$ = this.choseBrowserService.getBrowserList();
	isBrowserListEmpty$ = this.choseBrowserService.isBrowserListEmpty();

	showPrivacyScore = false;
	showNavigationBlock = false;
	showSupportBanner = false;

	pagesSettings: { [path in RoutersName]: PageSettings } = {
		[RoutersName.MAIN]: defaultPageSettings,
		tips: defaultPageSettings,
		privacy: defaultPageSettings,
		faq: defaultPageSettings,
		news: defaultPageSettings,
		landing: defaultPageSettings,
		articles: defaultPageSettings,
		trackers: {
			showPrivacyScore: true,
			showNavigationBlock: true,
			showSupportBanner: true,
		},
		breaches: {
			showPrivacyScore: true,
			showNavigationBlock: true,
			showSupportBanner: true,
		},
		'browser-accounts': {
			showPrivacyScore: true,
			showNavigationBlock: true,
			showSupportBanner: true,
		},
	};

	constructor(
		private taskActionService: TaskActionService,
		private locationHistoryService: LocationHistoryService,
		private commonPopupService: CommonPopupService,
		private choseBrowserService: ChoseBrowserService,
		private router: Router,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private trackingMapService: TrackingMapService,
		private routerChangeHandler: RouterChangeHandlerService,
	) {
	}

	ngOnInit() {
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
	}

	closePopUp(popupId) {
		this.commonPopupService.close(popupId);
	}

	choseBrowser(browserValue) {
		this.choseBrowserService.setBrowser(browserValue);
		this.trackingMapService.updateTrackingData();
		this.closePopUp(this.choseBrowserPopupId);
		this.router.navigateByUrl('/privacy/trackers');
	}
}
