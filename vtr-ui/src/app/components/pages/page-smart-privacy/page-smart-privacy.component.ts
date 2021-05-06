import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import {
	NOTIFICATION_MESSAGES,
	REQUEST_MESSAGES,
	SmartPrivacyMessengerService
} from '../../../services/smart-privacy/smart-privacy-messenger.service';
import { ModalSmartPrivacySubscribeComponent } from '../../modal/modal-smart-privacy-subscribe/modal-smart-privacy-subscribe.component';
import { ActivatedRoute } from '@angular/router';
import { SmartPrivacyListenService } from '../../../services/smart-privacy/smart-privacy-listen.service';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
	selector: 'vtr-page-smart-privacy',
	templateUrl: './page-smart-privacy.component.html',
	styleUrls: ['./page-smart-privacy.component.scss'],
})
export class PageSmartPrivacyComponent implements OnInit {
	@ViewChild('smartPrivacyIframe', {static: true}) smartPrivacyIframe: ElementRef<HTMLIFrameElement>;

	constructor(
		private smartPrivacyMessengerService: SmartPrivacyMessengerService,
		private smartPrivacyListenService: SmartPrivacyListenService,
		private route: ActivatedRoute,
		private dialog: MatDialog,
	) {
	}

	ngOnInit() {
		this.listenOpenBuyNow();
		this.smartPrivacyListenService.listenOpenPage(this.route.queryParams)
			.subscribe((message) => this.sendMessageToIframe(message));
	}

	private listenOpenBuyNow() {
		this.smartPrivacyMessengerService.getMessages().pipe(
			debounceTime(200),
			filter((message) => message.data === NOTIFICATION_MESSAGES.openBuyNow),
		).subscribe(() => this.openBuyNow());
	}

	private openBuyNow() {
		const modalRef = this.dialog.open(ModalSmartPrivacySubscribeComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			panelClass: 'subscribe-modal',
		});

		modalRef.afterClosed().subscribe(() => {
			this.sendMessageToIframe('openBuyNowClosed');
		});
	}

	private sendMessageToIframe(message: keyof typeof REQUEST_MESSAGES) {
		this.smartPrivacyMessengerService.sendMessage(message, this.smartPrivacyIframe.nativeElement.contentWindow);
	}
}
