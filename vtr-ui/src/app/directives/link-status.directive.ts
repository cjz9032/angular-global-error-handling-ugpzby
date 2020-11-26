import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';

import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

@Directive({
	selector: '[vtrLinkStatus]',
})
export class LinkStatusDirective {
	private isOnline = this.commonService.isOnline;
	constructor(
		private containerRef: ViewContainerRef,
		private template: TemplateRef<any>,
		private commonService: CommonService
	) {}

	@Input() set vtrLinkStatus(translatedString: string) {
		this.containerRef.createEmbeddedView(this.template);
		const element: HTMLElement = this.template.elementRef.nativeElement.nextElementSibling;
		element.insertAdjacentElement('afterend', document.createElement('span'));
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
			if (
				this.isOnline ||
				(element.attributes['unSupportOffline']
					? element.attributes['unSupportOffline']
					: false)
			) {
				element.innerText = translatedString;
				element.nextElementSibling.innerHTML = '';
			} else {
				element.innerText = '';
				element.nextElementSibling.innerHTML = translatedString;
			}
		});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}
}
