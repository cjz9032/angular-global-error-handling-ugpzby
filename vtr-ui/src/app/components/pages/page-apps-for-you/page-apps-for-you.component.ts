import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-page-apps-for-you',
	templateUrl: './page-apps-for-you.component.html',
	styleUrls: ['./page-apps-for-you.component.scss']
})
export class PageAppsForYouComponent implements OnInit {

	title = 'Apps & Offers';
	isOnline: boolean;
	notificationSubscription: Subscription;
	backId = 'support-page-btn-back';
	isCategoryArticlesShow: true;
	systemUpdateBridge: any;

	offlineImages = [
		'assets/images/support/support-offline-1.jpg',
		'assets/images/support/support-offline-2.jpg',
		'assets/images/support/support-offline-3.jpg',
		'assets/images/support/support-offline-4.jpg',
	];

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public deviceService: DeviceService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private shellService: VantageShellService
	) {
		this.isOnline = this.commonService.isOnline;
		this.systemUpdateBridge = shellService.getSystemUpdate();
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					break;
				default:
					break;
			}
		}
	}

	async clickInstall() {
		if (this.systemUpdateBridge) {
			const applicationGuid = 'FCF9F618-10F4-4230-99DD-F9B1CCB316AF';
			const result = await this.systemUpdateBridge.downloadAndInstallApp(applicationGuid, null,
			  (progress) => {
				console.log('******download and install app progress: ', progress);
			  });
			console.log('******install app result: ', result);
		}
	}

	onInnerBack() {

	}

	copyObjectArray(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

}
