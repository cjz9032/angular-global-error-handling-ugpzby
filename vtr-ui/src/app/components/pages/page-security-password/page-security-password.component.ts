import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { $ } from 'protractor';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss']
})
export class PageSecurityPasswordComponent implements OnInit {

	title = 'Password Health';
	back = 'BACK';
	backarrow = '< ';

	IsDashlaneInstalled: Boolean = false;
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
			'Page': 'password-protection',
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

	dashlane() {
		// window.open('https://www.dashlane.com/lenovo/');
		this.IsDashlaneInstalled = this.IsDashlaneInstalled ? false : true;
	}
}
