import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import {
	REQUEST_MESSAGES,
	SmartPrivacyMessengerService
} from '../../../services/smart-privacy/smart-privacy-messenger.service';
import { ModalSmartPrivacySubscribeComponent } from '../../modal/modal-smart-privacy-subscribe/modal-smart-privacy-subscribe.component';
import { ActivatedRoute } from '@angular/router';
import { SmartPrivacyListenService } from '../../../services/smart-privacy/smart-privacy-listen.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'vtr-page-smart-privacy',
	templateUrl: './page-smart-privacy.component.html',
	styleUrls: ['./page-smart-privacy.component.scss'],
})
export class PageSmartPrivacyComponent implements OnInit, OnDestroy {
	@ViewChild('smartPrivacyIframe', {static: true}) smartPrivacyIframe: ElementRef<HTMLIFrameElement>;
	private subs: Subscription[] = []

	constructor(
		private smartPrivacyMessengerService: SmartPrivacyMessengerService,
		private smartPrivacyListenService: SmartPrivacyListenService,
		private route: ActivatedRoute,
		private dialog: MatDialog,
	) {
	}

	ngOnInit() {
		this.subs.push(this.smartPrivacyListenService.listenOpenBuyNow().subscribe(() => this.openBuyNow()));
		this.subs.push(this.smartPrivacyListenService.listenOpenPage(this.route.queryParams)
			.subscribe((message) => this.sendMessageToIframe(message)));
	}

	ngOnDestroy() {
		this.subs.forEach(s => s.unsubscribe())
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
