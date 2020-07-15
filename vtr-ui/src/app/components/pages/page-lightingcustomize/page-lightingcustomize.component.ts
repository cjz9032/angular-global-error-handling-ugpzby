import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { Title } from '@angular/platform-browser';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Gaming } from './../../../enums/gaming.enum';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: [ './page-lightingcustomize.component.scss' ]
})
export class PageLightingcustomizeComponent implements OnInit, OnDestroy {
	isOnline = true;
	public currentProfileId: any;
	cardContentPositionC: any = {};
	cardContentPositionF: any = {};
	startDateTime: any = new Date();
	metrics: any;
	dynamic_metricsItem: any = 'lighting_profile_cms_inner_content';
	public ledlayoutversion: any;
	notificationSubscription: Subscription;

	private cmsSubscription: Subscription;

	constructor(
		private titleService: Title,
		private commonService: CommonService,
		private cmsService: CMSService,
		private route: ActivatedRoute,
		private shellService: VantageShellService,
		public dashboardService: DashboardService,
		private translate: TranslateService,
		public deviceService: DeviceService,
		private router: Router
	) {
		this.metrics = this.shellService.getMetrics();
		this.route.params.subscribe((params) => {
			this.currentProfileId = +params.id; // (+) converts string 'id' to a number
		});
		this.titleService.setTitle('gaming.common.narrator.pageTitle.lighting');

		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.getLayOutversion();
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.getLayOutversion();
			}
		});
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}

		if(this.cmsSubscription) this.cmsSubscription.unsubscribe();
	}

	onNotification(notification: AppNotification) {
		if (
			notification &&
			(notification.type === NetworkStatus.Offline || notification.type === NetworkStatus.Online)
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
			Page: 'lighting'
		};
		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
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
					this.cardContentPositionF.BrandName = this.cardContentPositionF.BrandName.split('|')[0];
				}
			}
		});

		if (!this.isOnline) {
			this.cardContentPositionC = {
				FeatureImage: 'assets/cms-cache/GamingPosC.jpg'
			};

			this.cardContentPositionF = {
				FeatureImage: 'assets/cms-cache/lighting_offline.jpg'
			};
		}
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}
	public getLayOutversion() {
		let ledSetFeature = this.commonService.getLocalStorageValue(LocalStorageKey.ledSetFeature);
		let ledDriver = this.commonService.getLocalStorageValue(LocalStorageKey.ledDriver);
		this.ledlayoutversion = this.commonService.getLocalStorageValue(LocalStorageKey.ledLayoutVersion);
		if(!ledSetFeature || !ledDriver || this.ledlayoutversion === undefined){
			this.router.navigate(['/device-gaming']);
		}
	}
}
