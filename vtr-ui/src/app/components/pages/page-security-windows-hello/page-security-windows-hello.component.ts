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

	windowsHello() {
		//window.open('https://www.dashlane.com/lenovo/');
		this.IsWindowsHelloInstalled = this.IsWindowsHelloInstalled ? false : true;
	}
}
