import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-macrokey',
	templateUrl: './page-macrokey.component.html',
	styleUrls: ['./page-macrokey.component.scss']
})
export class PageMacrokeyComponent implements OnInit {
	cardContentPositionA: any = {
		FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
	};
	cardContentPositionB: any = {
		FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
	};
	backId = 'vtr-gaming-macrokey-btn-back';

	constructor(private cmsService: CMSService) { }

	ngOnInit() {
		// TODO: Change the query params for macrokey subpage
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
}
