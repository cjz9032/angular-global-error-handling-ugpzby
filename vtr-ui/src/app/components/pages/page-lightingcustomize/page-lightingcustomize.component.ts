import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';


@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: ['./page-lightingcustomize.component.scss']
})
export class PageLightingcustomizeComponent implements OnInit {
	public currentProfileData: any;
	[x: string]: any;
	public homePage = {
		didSuccess: [
			{
				status: true
			},
			{
				status: false
			}
		],
		profileId: [
			{
				id: 0
			},
			{
				id: 1
			},
			{
				id: 2
			},
			{
				id: 3
			}
		]
	};

	constructor(private cmsService: CMSService) {}

	ngOnInit() {

		const queryOptions = {
			Page: 'dashboard',
			Lang: 'EN',
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'Lenovo'
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
