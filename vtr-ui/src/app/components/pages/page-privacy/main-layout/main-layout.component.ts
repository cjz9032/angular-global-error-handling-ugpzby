import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationHistoryService } from '../common/services/location-history.service';
import { CommonPopupService } from '../common/services/popups/common-popup.service';
import { Router } from '@angular/router';
import { CommunicationWithFigleafService } from '../utils/communication-with-figleaf/communication-with-figleaf.service';
import { TrackingMapService } from '../feature/tracking-map/services/tracking-map.service';
import { TaskActionService } from '../common/services/task-action.service';
import { UserAllowService } from '../common/services/user-allow.service';
import { BrowserAccountsService } from '../common/services/browser-accounts.service';

@Component({
	// selector: 'vtr-layer',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
	permitTrackersAndPasswordsPopupId = 'permitTrackersAndPasswordsPopup';

	constructor(
		private taskActionService: TaskActionService,
		private locationHistoryService: LocationHistoryService,
		private commonPopupService: CommonPopupService,
		private router: Router,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private trackingMapService: TrackingMapService,
		private userAllowService: UserAllowService,
		private browserAccountsService: BrowserAccountsService
	) {
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.communicationWithFigleafService.disconnect();
	}

	setPermit(isAllow: boolean, popupId: string) {
		if (isAllow) {
			this.userAllowService.setShowTrackingMap(true);
			this.browserAccountsService.giveConcent();
			this.trackingMapService.updateTrackingData();
		}
		this.commonPopupService.close(popupId);
	}
}
