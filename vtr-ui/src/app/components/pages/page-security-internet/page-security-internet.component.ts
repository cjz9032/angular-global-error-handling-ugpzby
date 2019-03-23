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
	cardContentPositionA: any = {};

	constructor(
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
