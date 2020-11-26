import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-macrokey',
	templateUrl: './page-macrokey.component.html',
	styleUrls: ['./page-macrokey.component.scss'],
})
export class PageMacrokeyComponent implements OnInit, OnDestroy {
	isOnline = true;
	backId = 'vtr-gaming-macrokey-btn-back';
	startDateTime: any = new Date();
	metrics: any;
	cardContentPositionC: any = {};
	cardContentPositionF: any = {};
	dynamic_metricsItem: any = 'macrokey_cms_inner_content';
	notificationSubscrition: Subscription;
	fetchSubscrition: Subscription;

	constructor(
		public dashboardService: DashboardService,
		private cmsService: CMSService,
		private shellService: VantageShellService,
		private commonService: CommonService,
		private translate: TranslateService,
		public deviceService: DeviceService
	) {
		this.metrics = this.shellService.getMetrics();
		this.fetchCMSArticles();

		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.notificationSubscrition = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
	}

	ngOnDestroy() {
		if (this.notificationSubscrition) {
			this.notificationSubscrition.unsubscribe();
		}

		if (this.fetchSubscrition) {
			this.fetchSubscrition.unsubscribe();
		}
	}

	onNotification(notification: AppNotification) {
		if (
			notification &&
			(notification.type === NetworkStatus.Offline ||
				notification.type === NetworkStatus.Online)
		) {
			this.isOnline = notification.payload.isOnline;
			this.fetchCMSArticles();
		}
		if (this.isOnline === undefined) {
			this.isOnline = true;
		}
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'macro-key',
		};
		this.fetchSubscrition = this.cmsService
			.fetchCMSContent(queryOptions)
			.subscribe((response: any) => {
				const cardContentPositionC = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-C'
				)[0];
				if (cardContentPositionC) {
					this.cardContentPositionC = cardContentPositionC;
				}
				const cardContentPositionF = this.cmsService.getOneCMSContent(
					response,
					'inner-page-right-side-article-image-background',
					'position-F'
				)[0];
				if (cardContentPositionF) {
					this.cardContentPositionF = cardContentPositionF;
					if (this.cardContentPositionF.BrandName) {
						this.cardContentPositionF.BrandName = this.cardContentPositionF.BrandName.split(
							'|'
						)[0];
					}
				}
			});

		if (!this.isOnline) {
			this.cardContentPositionC = {
				FeatureImage: 'assets/cms-cache/GamingPosC.jpg',
			};

			this.cardContentPositionF = {
				FeatureImage: 'assets/cms-cache/macrokey_offline.jpg',
			};
		}
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}
	}
}
