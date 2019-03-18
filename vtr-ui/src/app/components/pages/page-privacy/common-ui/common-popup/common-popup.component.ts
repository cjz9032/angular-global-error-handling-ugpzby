import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonPopupService, CommonPopupEventType } from '../../common-services/popups/common-popup.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-common-popup',
	templateUrl: './common-popup.component.html',
	styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit, OnDestroy {

	@Input() popUpId: string;

	isOpen = false;

	@Input() size: 'big' | 'large' | 'default' = 'default';

	constructor(private commonPopupService: CommonPopupService) {
	}

	ngOnInit() {
		const popup = this;

		// ensure popUpId attribute exists
		if (!popup.popUpId) {
			console.error('Attribute `popUpId` is required! Need add `popUpId` to vtr-common-popup');
			return;
		}

		this.commonPopupService
			.openState$(this.popUpId)
			.pipe(
				takeUntil(instanceDestroyed(this))
			)
			.subscribe(({id, isOpenState}: CommonPopupEventType) => {
				this.isOpen = isOpenState;
			});

	}

	ngOnDestroy() {
	}

	openPopup() { // not work now
		this.commonPopupService.open(this.popUpId);
	}

	closePopup() {
		this.commonPopupService.close(this.popUpId);
	}

	preventClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();
	}
}
