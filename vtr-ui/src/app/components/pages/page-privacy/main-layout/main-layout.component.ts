import { Component, OnInit } from '@angular/core';
import { LocationHistoryService } from '../shared/services/location-history.service';
import { CommonPopupService } from '../common-services/popups/common-popup.service';
import { ChoseBrowserService } from '../common-services/chose-browser.service';
import { Router } from '@angular/router';

@Component({
	// selector: 'vtr-layer',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
	choseBrowserPopupId = 'choseBrowserPopup';
	browserList$ = this.choseBrowserService.getBrowserList();

	constructor(
		private locationHistoryService: LocationHistoryService,
		private commonPopupService: CommonPopupService,
		private choseBrowserService: ChoseBrowserService,
		private router: Router,
	) {
	}

	ngOnInit() {
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
