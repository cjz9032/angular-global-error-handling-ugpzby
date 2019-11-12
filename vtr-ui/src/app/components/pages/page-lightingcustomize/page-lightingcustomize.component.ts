import { ModalGamingLegionedgeComponent } from './../../modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ActivatedRoute } from '@angular/router';
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

@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: [ './page-lightingcustomize.component.scss' ]
})
export class PageLightingcustomizeComponent implements OnInit, OnDestroy {
	isOnline = true;
	public currentProfileId: any;
	private isUPEFailed = false;
	private isCmsLoaded = false;

	cardContentPositionB: any = {};
	cardContentPositionF: any = {};
	cardContentPositionBCms: any = {};
	cardContentPositionFCms: any = {};
	dynamic_metricsItem: any = 'lighting_profile_cms_inner_content';

	upeRequestResult = {
		positionB: true,
		positionF: true
	};

	cmsRequestResult = {
		positionB: true,
		positionF: true
	};

	tileSource = {
		positionB: 'CMS',
		positionF: 'CMS'
	};
	startDateTime: any = new Date();
	metrics: any;

	constructor(
		private modalService: NgbModal,
		private titleService: Title,
		private commonService: CommonService,
		private cmsService: CMSService,
		private route: ActivatedRoute,
		private shellService: VantageShellService,
		public dashboardService: DashboardService,
		private gamingLightService: GamingLightingService,
		private upeService: UPEService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		private translate: TranslateService,
		public deviceService: DeviceService
	) {
		this.metrics = this.shellService.getMetrics();

		this.route.params.subscribe((params) => {
			this.currentProfileId = +params.id; // (+) converts string 'id' to a number
		});
		this.titleService.setTitle('gaming.common.narrator.pageTitle.lighting');
		this.isUPEFailed = false; // init UPE request status
		this.isCmsLoaded = false;

		this.setPreviousContent();
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {}
	ngOnDestroy() {}

	openModal() {
		this.modalService.open(ModalGamingLightingComponent, {
			backdrop: true,
			windowClass: 'gaming-lighting-cms-content-help'
		});
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.upeRequestResult = {
			positionB: true,
			positionF: true
		};

		this.cmsRequestResult = {
			positionB: false,
			positionF: false
		};
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard'
		};
		this.getTileSource().then(() => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
				const cardContentPositionF = this.cmsService.getOneCMSContent(
					response,
					'half-width-top-image-title-link',
					'position-F'
				)[0];
				if (cardContentPositionF) {
					this.cardContentPositionFCms = cardContentPositionF;
					this.cardContentPositionFCms.DataSource = 'cms';
					if (!this.upeRequestResult.positionF || this.tileSource.positionF === 'CMS') {
						this.cardContentPositionF = this.cardContentPositionFCms;
						this.gamingLightService.cardContentPositionF = this.cardContentPositionFCms;
					}
				}

				const cardContentPositionB = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-B'
				)[0];
				if (cardContentPositionB) {
					cardContentPositionB.DataSource = 'cms';
					this.cardContentPositionBCms = cardContentPositionB;
					if (this.cardContentPositionBCms.BrandName) {
						this.cardContentPositionBCms.BrandName = this.cardContentPositionBCms.BrandName.split('|')[0];
					}
					this.cmsRequestResult.positionB = true;
					if (!this.upeRequestResult.positionB || this.tileSource.positionB === 'CMS') {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.gamingLightService.cardContentPositionB = this.cardContentPositionBCms;
					}
				}
			});

			if (this.tileSource.positionB === 'UPE') {
				const upeParam = { position: 'position-B' };
				this.upeService.fetchUPEContent(upeParam).subscribe(
					(upeResp) => {
						const cardContentPositionB = this.upeService.getOneUPEContent(
							upeResp,
							'half-width-title-description-link-image',
							'position-B'
						)[0];
						if (cardContentPositionB) {
							this.cardContentPositionB = cardContentPositionB;
							if (this.cardContentPositionB.BrandName) {
								this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
							}
							this.cardContentPositionB.DataSource = 'upe';
							this.gamingLightService.cardContentPositionB = this.cardContentPositionB;
							this.upeRequestResult.positionB = true;
						}
					},
					(err) => {
						this.loggerService.info(`Cause by error: ${err}, position-B load CMS content.`);
						this.upeRequestResult.positionB = false;
						if (this.cmsRequestResult.positionB) {
							this.cardContentPositionB = this.cardContentPositionBCms;
							this.gamingLightService.cardContentPositionB = this.cardContentPositionBCms;
						}
					}
				);
			}

			if (this.tileSource.positionF === 'UPE') {
				const upeParam = { position: 'position-F' };
				this.upeService.fetchUPEContent(upeParam).subscribe(
					(upeResp) => {
						const cardContentPositionF = this.upeService.getOneUPEContent(
							upeResp,
							'half-width-top-image-title-link',
							'position-F'
						)[0];
						if (cardContentPositionF) {
							this.cardContentPositionF = cardContentPositionF;
							this.cardContentPositionF.DataSource = 'upe';
							this.gamingLightService.cardContentPositionF = this.cardContentPositionF;
							this.upeRequestResult.positionF = true;
						}
					},
					(err) => {
						this.loggerService.info(`Cause by error: ${err}, position-F load CMS content.`);
						this.upeRequestResult.positionF = false;
						if (this.cmsRequestResult.positionF) {
							this.cardContentPositionF = this.cardContentPositionFCms;
							this.gamingLightService.cardContentPositionF = this.cardContentPositionFCms;
						}
					}
				);
			}
		});
	}

	private getTileSource() {
		return new Promise((resolve) => {
			this.hypService.getAllSettings().then(
				(hyp: any) => {
					if (hyp) {
						this.tileSource.positionB = hyp.TileBSource === 'UPE' ? 'UPE' : 'CMS';
						this.tileSource.positionF = hyp.TileFSource === 'UPE' ? 'UPE' : 'CMS';
					}
					resolve();
				},
				() => {
					resolve();
					console.log('get tile source failed.');
				}
			);
		});
	}

	private setPreviousContent() {
		this.cardContentPositionF = this.gamingLightService.cardContentPositionF;
		this.cardContentPositionB = this.gamingLightService.cardContentPositionB;
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}
}
