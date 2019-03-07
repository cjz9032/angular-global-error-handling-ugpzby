import { Component, ElementRef, Input, OnInit, Output, OnDestroy } from '@angular/core';
import {CommonPopupService} from '../../common-services/popups/common-popup.service';

@Component({
	selector: 'vtr-common-popup',
	templateUrl: './common-popup.component.html',
	styleUrls: ['./common-popup.component.scss'],
	// providers: [CommonPopupService]
})
export class CommonPopupComponent implements OnInit, OnDestroy {

	@Input() popUpId: string;

	private isOpen: boolean = false;

	constructor(private commonPopupService: CommonPopupService, private el: ElementRef) {
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
