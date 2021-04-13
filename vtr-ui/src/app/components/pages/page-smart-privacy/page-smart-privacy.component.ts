import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SmartPrivacyMessengerService } from '../../../services/smart-privacy/smart-privacy-messenger.service';

@Component({
	selector: 'vtr-page-smart-privacy',
	templateUrl: './page-smart-privacy.component.html',
	styleUrls: ['./page-smart-privacy.component.scss'],
})
export class PageSmartPrivacyComponent implements OnInit {
	@ViewChild('smartPrivacyIframe', {static: true}) smartPrivacyIframe: ElementRef<HTMLIFrameElement>;

	constructor(private smartPrivacyMessengerService: SmartPrivacyMessengerService) {
	}

	ngOnInit() {
		// this.smartPrivacyMessengerService.getMessages()
		// 	.subscribe((payload) => ('smartPrivacyMessengerService'));

		// setTimeout(() => this.smartPrivacyMessengerService.sendMessage('to-smart-privacy:open', this.smartPrivacyIframe.nativeElement.contentWindow), 5000);
	}
}
