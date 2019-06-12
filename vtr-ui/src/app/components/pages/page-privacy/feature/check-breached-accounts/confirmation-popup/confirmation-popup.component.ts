import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmailScannerService } from '../services/email-scanner.service';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-confirmation-popup',
	templateUrl: './confirmation-popup.component.html',
	styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit, OnDestroy {
	@Input() popupId: string;

	constructor(
		private commonPopupService: CommonPopupService,
		private emailScannerService: EmailScannerService) {
	}

	ngOnInit() {
		this.commonPopupService.getOpenState(this.popupId)
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((state) => !state.isOpenState)
			)
			.subscribe(() => {
				this.emailScannerService.cancelVerification();
			});
	}

	ngOnDestroy() {
	}

	closePopup() {
		this.commonPopupService.close(this.popupId);
	}
}
