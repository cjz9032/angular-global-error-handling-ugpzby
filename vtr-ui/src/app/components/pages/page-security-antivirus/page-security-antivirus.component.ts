import { Component,	OnInit,	HostListener, Input } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { VantageShellService} from 'src/app/services/vantage-shell/vantage-shell.service';
import { Antivirus,	McAfeeInfo,	WindowsDefender, OtherInfo} from '@lenovo/tan-client-bridge';
import { EventTypes } from '@lenovo/tan-client-bridge';
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
	mcafee: McAfeeInfo;
	windowsDefender: WindowsDefender;
	otherAntiVirus: OtherInfo;
	otherFirewall: OtherInfo;
	urlPrivacyPolicy = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';
	urlTermsOfService = 'https://www.mcafee.com/consumer/en-us/policy/global/legal.html';

	@HostListener('window:focus')
	onFocus(): void {
		this.antiVirus.refresh();
		console.log(this.antiVirus);
	}

	value = 1;
	articles: [];

	constructor(public mockService: MockService, public VantageShell: VantageShellService, private cmsService: CMSService) {
		this.antiVirus = this.VantageShell.getSecurityAdvisor().antivirus;
		// this.antiVirus = mockService.antiVirus;
		this.windowsDefender = this.antiVirus.windowsDefender;
		this.mcafee = this.antiVirus.mcafee;
		if (this.antiVirus.others) {
			if (this.antiVirus.others.firewall && this.antiVirus.others.firewall.length > 0) {
				this.otherFirewall = this.antiVirus.others.firewall[0];
			}
			if (this.antiVirus.others.antiVirus && this.antiVirus.others.antiVirus.length > 0) {
				this.otherAntiVirus = this.antiVirus.others.antiVirus[0];
			}
		}

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
