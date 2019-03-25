import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit {

	title = 'Windows Hello';
	back = 'BACK';
	backarrow = '< ';

	IsWindowsHelloInstalled: Boolean = true;
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
			'Page': 'windows-hello',
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

	windowsHello() {
		//window.open('https://www.dashlane.com/lenovo/');
		this.IsWindowsHelloInstalled = this.IsWindowsHelloInstalled ? false : true;
	}
}
