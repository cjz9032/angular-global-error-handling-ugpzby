import { Component, OnInit } from '@angular/core';
import { CommonPopupService } from '../../services/popups/common-popup.service';

@Component({
	selector: 'vtr-support-widget',
	templateUrl: './support-widget.component.html',
	styleUrls: ['./support-widget.component.scss']
})
export class SupportWidgetComponent implements OnInit {

	constructor(
		private commonPopupService: CommonPopupService
	) {
	}

	ngOnInit() {
	}

	openPopup(id) {
		this.commonPopupService.open(id);
	}

}
