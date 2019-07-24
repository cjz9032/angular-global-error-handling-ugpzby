import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';

@Pipe({
	name: 'svgInline',
	pure: false
})
export class SvgInlinePipe implements PipeTransform, OnDestroy {

	isOnline = true;
	notificationSubscription: Subscription;

	constructor(private sanitizer: DomSanitizer, private commonService: CommonService) {
		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy(): void {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	getContent(url) {
		return new Promise(resovle => {
			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.send(null);
			request.onreadystatechange = () => {
				if (request.readyState === 4 && request.status === 200) {
					resovle(request.responseText);
				}
			};
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

	transform(value: any, args?: any): any {
		if (typeof (value) !== 'undefined') {
			return new Observable(observer => {
				observer.next('');
				if (value.substring(value.lastIndexOf('.')) === '.svg' && !this.isOnline) {
					this.getContent(value).then(val => {
						val = `data:image/svg+xml;base64,${btoa(val + '')}`;
						val = this.sanitizer.bypassSecurityTrustResourceUrl(val + '');
						observer.next(val);
						observer.complete();
					});
				} else {
					observer.next(value);
					observer.complete();
				}
			});
		} else {
			return Promise.resolve('null');
		}
	}
}
