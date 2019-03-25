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
			'Page': 'anti-virus',
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
