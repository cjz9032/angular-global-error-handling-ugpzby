import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationHistoryService } from '../common/services/location-history.service';
import { CommonPopupService } from '../common/services/popups/common-popup.service';
import { Router } from '@angular/router';
import { CommunicationWithFigleafService } from '../utils/communication-with-figleaf/communication-with-figleaf.service';
import { TrackingMapService } from '../feature/tracking-map/services/tracking-map.service';
import { TaskActionService } from '../common/services/task-action.service';
import { UserAllowService } from '../common/services/user-allow.service';
import { BrowserAccountsService } from '../common/services/browser-accounts.service';
import { RouterChangeHandlerService } from '../common/services/router-change-handler.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../utils/custom-rxjs-operators/instance-destroyed';
import { RoutersName } from '../privacy-routing-name';

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
	permitTrackersAndPasswordsPopupId = 'permitTrackersAndPasswordsPopup';

	showPrivacyScore = false;
	showNavigationBlock = false;
	showSupportBanner = false;
	moveBlockToTop = false;

	pagesSettings: { [path in RoutersName]: PageSettings } = {
		[RoutersName.LANDING]: defaultPageSettings,
		[RoutersName.ARTICLES]: defaultPageSettings,
		[RoutersName.TRACKERS]: featurePageSettings,
		[RoutersName.BREACHES]: featurePageSettings,
		[RoutersName.PRIVACY]: featurePageSettings,
		[RoutersName.MAIN]: featurePageSettings,
		[RoutersName.BROWSERACCOUNTS]: featurePageSettings,
	};

	constructor(
		private taskActionService: TaskActionService,
		private locationHistoryService: LocationHistoryService,
		private commonPopupService: CommonPopupService,
		private router: Router,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private trackingMapService: TrackingMapService,
		private userAllowService: UserAllowService,
		private browserAccountsService: BrowserAccountsService,
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
		this.moveBlockToTop = this.pagesSettings[routerPage].moveBlockToTop;
	}

	setPermit(isAllow: boolean, popupId: string) {
		if (isAllow) {
			this.userAllowService.setShowTrackingMap(true);
			this.browserAccountsService.giveConcent();
			this.trackingMapService.updateTrackingData();
			this.router.navigateByUrl('/privacy/trackers');
		}
		this.commonPopupService.close(popupId);
	}
}
