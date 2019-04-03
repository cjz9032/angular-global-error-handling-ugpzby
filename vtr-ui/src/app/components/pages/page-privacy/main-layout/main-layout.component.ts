import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationHistoryService } from '../shared/services/location-history.service';
import { CommonPopupService } from '../common-services/popups/common-popup.service';
import { ChoseBrowserService } from '../common-services/chose-browser.service';
import { Router } from '@angular/router';
import { CommunicationWithFigleafService } from '../communication-with-figleaf/communication-with-figleaf.service';
import { SafeStorageService } from '../shared/services/safe-storage.service';
import { SettingsStorageService } from "../shared/services/settings-storage.service";

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
		private safeStorageService: SafeStorageService,
		private settingsStorageService: SettingsStorageService,
	) {
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.communicationWithFigleafService.disconnect()
	}

	closePopUp(popupId) {
		this.commonPopupService.close(popupId);
	}

	choseBrowser(browserValue) {
		this.choseBrowserService.setBrowser(browserValue);
		this.closePopUp(this.choseBrowserPopupId);
		this.router.navigateByUrl('/privacy/trackers');
	}
}
