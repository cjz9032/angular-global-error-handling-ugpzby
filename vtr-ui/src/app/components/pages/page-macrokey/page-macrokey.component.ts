import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-macrokey',
	templateUrl: './page-macrokey.component.html',
	styleUrls: [ './page-macrokey.component.scss' ]
})
export class PageMacrokeyComponent implements OnInit {

	cardContentPositionA: any = {};
	cardContentPositionB: any = {};

	constructor(
		private cmsService: CMSService,
	) {}

	ngOnInit() {
		// TODO: Change the query params for macrokey subpage
		const queryOptions = {
			'Page': 'dashboard',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then((response: any) => {
			const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-F')[0];
			if (cardContentPositionA) {
				this.cardContentPositionA = cardContentPositionA;
			}

			const cardContentPositionB = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-B')[0];
			if (cardContentPositionB) {
				this.cardContentPositionB = cardContentPositionB;
				if (this.cardContentPositionB.BrandName) {
					this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
				}
			}
		});
	}
}
