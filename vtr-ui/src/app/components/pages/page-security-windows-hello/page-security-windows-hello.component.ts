import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit {

	title = 'Windows Hello';

	windowsHello: WindowsHello;
	status: string;
	articles: [];

	constructor(public mockService: MockService, private cmsService: CMSService, vantageShellService: VantageShellService) {
		this.windowsHello = vantageShellService.getSecurityAdvisor().windowsHello;
		this.updateStatus();
		this.windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.updateStatus();
		}).on(EventTypes.helloFacialIdStatusEvent, () => {
			this.updateStatus();
		});
		this.fetchCMSArticles();
	}

	ngOnInit() { }

	setUpWindowsHello(): void {
		this.windowsHello.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.windowsHello.refresh();
	}

	private updateStatus(): void {
		if (this.windowsHello.fingerPrintStatus === 'active' ||
			this.windowsHello.facialIdStatus === 'active') {
			this.status = 'enabled';
		} else {
			this.status = 'disabled';
		}
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
}
