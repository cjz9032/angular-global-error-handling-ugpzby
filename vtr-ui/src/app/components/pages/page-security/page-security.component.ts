import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../../services/security/security.service';
import { MockService } from '../../../services/mock/mock.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})
export class PageSecurityComponent implements OnInit {
	title = 'Security';
	cardContentPositionA: any = {};
	cardContentPositionB: any = {};

	constructor(
		public securityService: SecurityService,
		public mockService: MockService,
		private cmsService: CMSService
	) { }

	ngOnInit() {
		const queryOptions = {
			'Page': 'dashboard',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-E')[0];
				this.cardContentPositionB = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];

				this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
