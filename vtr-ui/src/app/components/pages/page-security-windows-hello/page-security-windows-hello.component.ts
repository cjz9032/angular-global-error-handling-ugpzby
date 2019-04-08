import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { WindowsHello, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { CMSService } from '../../../services/cms/cms.service';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit {

	windowsHello: WindowsHello;
	statusItem: any;
	cardContentPositionA: any;
	securityAdvisor: SecurityAdvisor;

	constructor(
		public mockService: MockService,
		private cmsService: CMSService,
		private commonService: CommonService,
		vantageShellService: VantageShellService
	) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		this.statusItem = {
			title: 'security.windowsHello.statusTitle'
		};
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
		const cacheStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus);
		if (cacheStatus) {
			this.statusItem.status = cacheStatus;
		}
		if (this.windowsHello && (this.windowsHello.fingerPrintStatus || this.windowsHello.facialIdStatus)) {
			if (this.windowsHello.fingerPrintStatus === 'active' ||
				this.windowsHello.facialIdStatus === 'active') {
				this.statusItem.status = 'enabled';
			} else {
				this.statusItem.status = 'disabled';
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsHelloStatus, this.statusItem.status);
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

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
