import { Component } from '@angular/core';
import { CommonPopupService } from '../../core/services/popups/common-popup.service';

@Component({
	selector: 'vtr-support-banner',
	templateUrl: './support-banner.component.html',
	styleUrls: ['./support-banner.component.scss'],
})
export class SupportBannerComponent {

	constructor(
		private commonPopupService: CommonPopupService) {
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}
}
