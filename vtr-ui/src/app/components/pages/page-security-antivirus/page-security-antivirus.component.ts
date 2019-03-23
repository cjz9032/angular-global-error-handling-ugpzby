import { Component, OnInit, Input } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
})
export class PageSecurityAntivirusComponent implements OnInit {
	@Input() public productName = 'product name';

	title = 'Anti-Virus';
	subTitle = `You are currently being protected by ${this.productName}.
	However, you could be better protected with McAfee LiveSafe. Learn more below.`;
	avType = 2;
	back = 'BACK';
	backarrow = '< ';
	value = 1;
	cardContentPositionA: any = {};

	constructor(
		public mockService: MockService,
		private cmsService: CMSService
	) {

	}

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
}
