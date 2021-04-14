import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import {
	MESSAGES,
	SmartPrivacyMessengerService
} from '../../../services/smart-privacy/smart-privacy-messenger.service';
import { ModalSmartPrivacySubscribeComponent } from '../../modal/modal-smart-privacy-subscribe/modal-smart-privacy-subscribe.component';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'vtr-page-smart-privacy',
	templateUrl: './page-smart-privacy.component.html',
	styleUrls: ['./page-smart-privacy.component.scss'],
})
export class PageSmartPrivacyComponent implements OnInit {
	@ViewChild('smartPrivacyIframe', {static: true}) smartPrivacyIframe: ElementRef<HTMLIFrameElement>;

	constructor(
		private smartPrivacyMessengerService: SmartPrivacyMessengerService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit() {
		this.smartPrivacyMessengerService.getMessages().pipe(
			filter((message) => message.data === MESSAGES.openBuyNow)
		).subscribe(() => this.openBuyNow());
	}

	openBuyNow() {
		const modalRef = this.dialog.open(ModalSmartPrivacySubscribeComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'subscribe-modal',
		});

		modalRef.afterClosed().subscribe(() => {
			this.smartPrivacyMessengerService.sendMessage('openBuyNowClosed', this.smartPrivacyIframe.nativeElement.contentWindow);
		});
	}
}
