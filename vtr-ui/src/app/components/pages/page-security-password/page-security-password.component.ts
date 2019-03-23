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
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
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
