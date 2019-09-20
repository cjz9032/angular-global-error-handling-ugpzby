import { Component, OnInit, OnDestroy } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ActivatedRoute } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: ['./page-lightingcustomize.component.scss']
})
export class PageLightingcustomizeComponent implements OnInit, OnDestroy {
	isOnline = true;
	public currentProfileId: any;
	cardContentPositionA: any = {
		FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
	};
	cardContentPositionB: any = {
		FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
	};
	startDateTime: any = new Date();
	metrics: any;

	constructor(private cmsService: CMSService, private route: ActivatedRoute, private shellService: VantageShellService,private commonService: CommonService) {
		this.metrics = this.shellService.getMetrics();

		this.route.params.subscribe((params) => {
			this.currentProfileId = +params['id']; // (+) converts string 'id' to a number
		});
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard'
		};

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
				this.cardContentPositionB = cardContentPositionB;
				if (this.cardContentPositionB.BrandName) {
					this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
				}
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
