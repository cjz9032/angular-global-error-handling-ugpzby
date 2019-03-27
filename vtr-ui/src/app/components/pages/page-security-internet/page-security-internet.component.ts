import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { Vpn, EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit {

	title = 'VPN Security';

	vpn: Vpn;
	status: string;
	articles: [];

	constructor(public mockService: MockService, private cmsService: CMSService, vantageShellService: VantageShellService) {
		this.vpn = vantageShellService.getSecurityAdvisor().vpn;
		this.status = this.vpn.status;
		this.vpn.on(EventTypes.vpnStatusEvent, (status: string) => {
			this.status = status;
		});
		this.fetchCMSArticles();
	}

	ngOnInit() {}

	getSurfEasy(): void {
		this.vpn.download();
	}

	openSurfEasy(): void {
		this.vpn.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.vpn.refresh();
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'internet-protection',
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
