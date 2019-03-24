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
	articles: [];

	constructor(
		public securityService: SecurityService,
		public mockService: MockService,
		private cmsService: CMSService
	) {
		this.fetchCMSArticles();
	}

	ngOnInit() {
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'security',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSArticles(queryOptions).then(
			(response: any) => {
				this.articles = response;
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
