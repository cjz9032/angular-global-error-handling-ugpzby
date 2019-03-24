import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-wifi',
	templateUrl: './page-security-wifi.component.html',
	styleUrls: ['./page-security-wifi.component.scss']
})
export class PageSecurityWifiComponent implements OnInit {

	title = 'WiFi and Connected Home Security';
	back = 'BACK';
	backarrow = '< ';
	isLWSEnabled = false;
	viewSecChkRoute = 'viewSecChkRoute';
	articles: [];

	constructor(
		public mockService: MockService,
		private cmsService: CMSService
	) { }

	ngOnInit() {
		const queryOptions = {
			'Page': 'wifi-security',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSArticles(queryOptions).then(
			(response: any) => {
				console.log('response', response);

				this.articles = response;
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	enableWiFiSecurity(event) {
		console.log('enableWiFiSecurity button clicked');
		this.isLWSEnabled = !this.isLWSEnabled;
	}
}
