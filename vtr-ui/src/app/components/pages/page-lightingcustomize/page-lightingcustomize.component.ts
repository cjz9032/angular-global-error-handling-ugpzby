import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { Title } from '@angular/platform-browser';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { GamingLightingService } from 'src/app/services/gaming/lighting/gaming-lighting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGamingLightingComponent } from '../../modal/modal-gaming-lighting/modal-gaming-lighting.component';
import { DeviceService } from 'src/app/services/device/device.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Gaming } from './../../../enums/gaming.enum';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';

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
	public ledlayoutversion:any;

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
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	ngOnDestroy() {}

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
		this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
			const cardContentPositionF = this.cmsService.getOneCMSContent(
				response,
				'half-width-top-image-title-link',
				'position-F'
			)[0];
			if (cardContentPositionF) {
				this.cardContentPositionF = cardContentPositionF;
			}

			const cardContentPositionC = this.cmsService.getOneCMSContent(
				response,
				'half-width-title-description-link-image',
				'position-C'
			)[0];
			if (cardContentPositionC) {
				this.cardContentPositionC = cardContentPositionC;
				if (this.cardContentPositionC.BrandName) {
					this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
				}
			}
		});

		if (!this.isOnline) {
			this.cardContentPositionF = {
				FeatureImage: './../../../../assets/cms-cache/GamingPosC.jpg'
			};

			this.cardContentPositionC = {
				FeatureImage: './../../../../assets/cms-cache/lighting_offline.jpg'
			};
		}
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}
	public getLayOutversion(){
        if(this.commonService.getLocalStorageValue(LocalStorageKey.ledLayoutVersion) !== undefined){
			this.ledlayoutversion = this.commonService.getLocalStorageValue(LocalStorageKey.ledLayoutVersion);
		}else{
			this.router.navigate(['/device-gaming']);
		}
    }
}
