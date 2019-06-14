import { Component, OnInit } from '@angular/core';
import { CommonPopupService } from '../../services/popups/common-popup.service';

@Component({
	selector: 'vtr-support-banner',
	templateUrl: './support-banner.component.html',
	styleUrls: ['./support-banner.component.scss'],
})
export class SupportBannerComponent implements OnInit {

	constructor(
		private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}
}
