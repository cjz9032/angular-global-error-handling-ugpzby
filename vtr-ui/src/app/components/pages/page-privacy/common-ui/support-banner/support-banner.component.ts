import { Component, OnInit } from '@angular/core';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';

@Component({
	selector: 'vtr-support-banner',
	templateUrl: './support-banner.component.html',
	styleUrls: ['./support-banner.component.scss', './support-popup.scss']
})
export class SupportBannerComponent implements OnInit {

	constructor(private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
		// TODO delete me after review
		this.commonPopupService.openState$('support-popup')
			.subscribe(({id, isOpenState: state}) => console.log('isOpen', state, id));
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}

	closePopup(id) {
		this.commonPopupService.close(id);
	}
}
