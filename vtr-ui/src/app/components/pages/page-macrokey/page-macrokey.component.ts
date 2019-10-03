import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
	selector: 'vtr-page-macrokey',
	templateUrl: './page-macrokey.component.html',
	styleUrls: ['./page-macrokey.component.scss']
})
export class PageMacrokeyComponent implements OnInit, OnDestroy {
	isOnline = true;
	cardContentPositionA: any = {
		FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
	};
	cardContentPositionB: any = {
		FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
	};
	cardContentPositionBCms: any = {};
	private isUPEFailed = false;
	private isCmsLoaded = false;
	backId = 'vtr-gaming-macrokey-btn-back';
	startDateTime: any = new Date();
	metrics: any;
	constructor(
		private cmsService: CMSService, private shellService: VantageShellService,
		private commonService: CommonService, public dashboardService: DashboardService,
		private upeService: UPEService, private loggerService: LoggerService,
		private hypService: HypothesisService, private translate: TranslateService) {
		this.metrics = this.shellService.getMetrics();
		this.isUPEFailed = false;  // init UPE request status
		this.isCmsLoaded = false;
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard'
		};
		this.getTileBSource().then((source) => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(
					response,
					'half-width-top-image-title-link',
					'position-F'
				)[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
				}

				const cardContentPositionB = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-B'
				)[0];
				if (cardContentPositionB) {
					if (this.cardContentPositionB.BrandName) {
						this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split(
							'|'
						)[0];
					}
					cardContentPositionB.DataSource = 'cms';

					this.cardContentPositionBCms = cardContentPositionB;
					this.isCmsLoaded = true;
					if (this.isUPEFailed || source === 'CMS') {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.dashboardService.cardContentPositionB = this.cardContentPositionBCms;
					}
				}
			});
			if (source === 'UPE') {
				const upeParam = {
					position: 'position-B'
				};
				this.upeService.fetchUPEContent(upeParam).subscribe((upeResp) => {
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
						cardContentPositionB.DataSource = 'upe';
						this.dashboardService.cardContentPositionB = cardContentPositionB;
						this.isUPEFailed = false;
					}
				}, (err) => {
					this.loggerService.info(`Cause by error: ${err}, position-B load CMS content.`);
					this.isUPEFailed = true;
					if (this.isCmsLoaded) {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.dashboardService.cardContentPositionB = this.cardContentPositionBCms;
					}
				});
			}
		});
	}

	private getTileBSource() {
		return new Promise((resolve) => {
			this.hypService.getFeatureSetting('TileBSource').then((source) => {
				if (source === 'UPE') {
					resolve('UPE');
				} else {
					resolve('CMS');
				}
			}, () => {
				resolve('CMS');
			});
		});
	}

	ngOnDestroy() {
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}
}
