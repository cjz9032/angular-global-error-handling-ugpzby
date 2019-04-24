import { Component, OnInit } from '@angular/core';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { VantageCommunicationService } from '../../common-services/vantage-communication.service';

@Component({
	selector: 'vtr-support-banner',
	templateUrl: './support-banner.component.html',
	styleUrls: ['./support-banner.component.scss', './support-popup.scss'],
})
export class SupportBannerComponent implements OnInit {

	constructor(
		private commonPopupService: CommonPopupService,
		private vantageCommunicationService: VantageCommunicationService) {
	}

	ngOnInit() {
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}

	closePopup(id) {
		this.commonPopupService.close(id);
	}

	openLenovoSupport() {
		this.vantageCommunicationService.openUri('https://support.lenovo.com');
	}
}
