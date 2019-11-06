import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ActivatedRoute } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { GamingLightingService } from 'src/app/services/gaming/lighting/gaming-lighting.service';

@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: ['./page-lightingcustomize.component.scss']
})
export class PageLightingcustomizeComponent implements OnInit, OnDestroy {
	isOnline = true;
	public currentProfileId: any;
	articleContent: any = {};
	startDateTime: any = new Date();
	metrics: any;

	constructor(
		private cmsService: CMSService,
		private route: ActivatedRoute,
		private shellService: VantageShellService,
		private commonService: CommonService,
		private gamingLightService: GamingLightingService,
		private upeService: UPEService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		private translate: TranslateService) {
		this.metrics = this.shellService.getMetrics();

		this.route.params.subscribe((params) => {
			this.currentProfileId = +params.id; // (+) converts string 'id' to a number
		});

		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
	}
	ngOnDestroy() {
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'lighting',
			Lang: 'en',
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Brand: 'idea',
			Segment: 'gaming'
		};
		this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
			if (Object.keys(response).length) {
				this.articleContent = response[0];
			}
		});
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}
}
