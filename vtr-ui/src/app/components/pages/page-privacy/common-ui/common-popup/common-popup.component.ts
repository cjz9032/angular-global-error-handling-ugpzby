import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {CommonPopupService} from '../../common-services/popups/common-popup.service';

@Component({
	selector: 'vtr-common-popup',
	templateUrl: './common-popup.component.html',
	styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit, OnDestroy {

	@Input() popUpId: string;

	isOpen = false;

	constructor(private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
		const popup = this;

		// ensure popUpId attribute exists
		if (!popup.popUpId) {
			console.error('Attribute `popUpId` is required! Need add `popUpId` to vtr-common-popup');
			return;
		}

		this.commonPopupService.add(popup);
	}

	ngOnDestroy() {
		this.commonPopupService.remove(this.popUpId);
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}
