import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: ['./page-lightingcustomize.component.scss']
})
export class PageLightingcustomizeComponent implements OnInit {
	public currentProfileId: any;
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

	cardContentPositionA: any = {
		FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
	};
	cardContentPositionB: any = {
		FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
	};

	constructor(private cmsService: CMSService, private route: ActivatedRoute) {
		this.route.params.subscribe((params) => {
			this.currentProfileId = +params['id']; // (+) converts string 'id' to a number
		});
		//console.log('id----------------------------------', this.currentProfileId);
	}

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

		// this.cmsService.fetchCMSContent(queryOptions).then((response: any) => {
		// 	const cardContentPositionA = this.cmsService.getOneCMSContent(
		// 		response,
		// 		'half-width-top-image-title-link',
		// 		'position-F'
		// 	)[0];
		// 	if (cardContentPositionA) {
		// 		this.cardContentPositionA = cardContentPositionA;
		// 	}

		// 	const cardContentPositionB = this.cmsService.getOneCMSContent(
		// 		response,
		// 		'half-width-title-description-link-image',
		// 		'position-B'
		// 	)[0];
		// 	if (cardContentPositionB) {
		// 		this.cardContentPositionB = cardContentPositionB;
		// 		if (this.cardContentPositionB.BrandName) {
		// 			this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
		// 		}
		// 	}
		// });
	}
}
