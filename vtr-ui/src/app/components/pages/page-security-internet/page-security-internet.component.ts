import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit {
	title = 'VPN Security';
	back = 'BACK';
	backarrow = '< ';
	IsDashlaneInstalled: Boolean = true;
	articles: [];

	constructor(
		public mockService: MockService,
		private cmsService: CMSService
	) {
		this.fetchCMSArticles();
	}

	ngOnInit() {
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'internet-protection',
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

	surfeasy() {
		//window.open('https://www.surfeasy.com/lenovo/');
		this.IsDashlaneInstalled = this.IsDashlaneInstalled ? false : true;
	}
}
