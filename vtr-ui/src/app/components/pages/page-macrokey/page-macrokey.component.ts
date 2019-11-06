import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';

@Component({
	selector: 'vtr-page-macrokey',
	templateUrl: './page-macrokey.component.html',
	styleUrls: ['./page-macrokey.component.scss']
})
export class PageMacrokeyComponent implements OnInit, OnDestroy {
	isOnline = true;
	backId = 'vtr-gaming-macrokey-btn-back';
	startDateTime: any = new Date();
	metrics: any;
	articleContent: any = {};

	constructor(
		private cmsService: CMSService,
		private shellService: VantageShellService,
		private commonService: CommonService,
		private macroKeyService: MacrokeyService,
		private upeService: UPEService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		private translate: TranslateService) {
		this.metrics = this.shellService.getMetrics();
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
			Page: 'macro-key',
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

	ngOnDestroy() {
	}

	sendMetricsAsync(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		} else {
		}
	}
}
