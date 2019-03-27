import { Component, OnInit, HostListener, Input } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AntiVirusViewMode } from 'src/app/data-models/security-advisor/antivirus.model';
import { Antivirus } from '@lenovo/tan-client-bridge';
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
	antiVirus: Antivirus;
	viewMode: any;
	urlPrivacyPolicy = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlTermsOfService = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	articles=[] ;

	@HostListener('window:focus')
	onFocus(): void {
		this.antiVirus.refresh();
	}

	constructor(public mockService: MockService, public VantageShell: VantageShellService ,public cmsService: CMSService) {
		this.antiVirus = this.VantageShell.getSecurityAdvisor().antivirus;
		this.viewMode = new AntiVirusViewMode(this.antiVirus);
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





