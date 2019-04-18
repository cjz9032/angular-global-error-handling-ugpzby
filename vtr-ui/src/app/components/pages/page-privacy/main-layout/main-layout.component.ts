import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationHistoryService } from '../shared/services/location-history.service';
import { CommonPopupService } from '../common-services/popups/common-popup.service';
import { ChoseBrowserService } from '../common-services/chose-browser.service';
import { Router } from '@angular/router';
import { CommunicationWithFigleafService } from '../communication-with-figleaf/communication-with-figleaf.service';
import { TrackingMapService } from '../common-services/tracking-map.service';

@Component({
	// selector: 'vtr-layer',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
	choseBrowserPopupId = 'choseBrowserPopup';
	browserList$ = this.choseBrowserService.getBrowserList();

	constructor(
		private locationHistoryService: LocationHistoryService,
		private commonPopupService: CommonPopupService,
		private choseBrowserService: ChoseBrowserService,
		private router: Router,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private trackingMapService: TrackingMapService,
	) {
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.communicationWithFigleafService.disconnect();
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
