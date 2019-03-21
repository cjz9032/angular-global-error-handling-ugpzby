import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { UserService } from 'src/app/services/user/user.service';
import {AppNotification} from 'src/app/data-models/common/app-notification.model';
import {LenovoIdKey} from 'src/app/enums/lenovo-id-key.enum';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss'],
	providers: [NgbModalConfig, NgbModal]
})
export class PageDashboardComponent implements OnInit {
	firstName = 'User';
	submit = 'Submit';
	feedbackButtonText = this.submit;
	public systemStatus: Status[] = [];
	public securityStatus: Status[] = [];

	cardContentPositionB: any = {};
	cardContentPositionC: any = {};

	/*forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};*/

	constructor(
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private commonService: CommonService,
		public deviceService: DeviceService,
		public cmsService: CMSService
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit() {
		if (this.dashboardService.isShellAvailable) {
			console.log('PageDashboardComponent.getSystemInfo');
			this.getSystemInfo();
			this.getSecurityStatus();
		}

		let queryOptions = {
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
				console.log('fetchCMSContent response', response);

				this.cardContentPositionB = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-B')[0];
				this.cardContentPositionC = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];

				console.log('this.cardContentPositionB', this.cardContentPositionB);
				console.log('this.cardContentPositionC', this.cardContentPositionC);

				this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
				this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	onFeedbackModal(content: any) {
		this.modalService
			.open(content, {
				centered: true
			})
			.result.then(
				result => {
					// on open
				},
				reason => {
					// on close
				}
			);
	}

	public onFeedbackClick() {
		this.feedbackButtonText = 'Thank you for your feedback !';
		setTimeout(() => {
			this.modalService.dismissAll();
			this.feedbackButtonText = this.submit;
		}, 3000);
	}

	private getFormatedTitle(title) {
		var formatedTitle = 'Looking energized today ' + title + '!';
		return formatedTitle;
	}

	private getSystemInfo() {
		this.dashboardService.getSystemInfo()
			.then((value: any) => {
				this.systemStatus = this.mapSystemInfoResponse(value);
				console.log('getSystemInfo.then', value, this.systemStatus);
			}).catch(error => {
				console.error('getSystemInfo', error);
			});
	}

	private getSecurityStatus() {
		this.dashboardService.getSecurityStatus()
			.then((value: any) => {
				this.securityStatus = this.mapSecurityStatusResponse(value);
				console.log('getSecurityStatus.then', value);
			}).catch(error => {
				console.error('getSecurityStatus', error);
			});
	}

	private mapSystemInfoResponse(response: any): Status[] {
		const systemStatus: Status[] = [];
		if (response) {
			const memory = new Status();
			memory.status = 1;
			memory.id = 'memory';
			memory.title = 'Memory';
			memory.detail = 'Memory not found';
			memory.path = 'ms-settings:about';
			memory.asLink = false;
			memory.isSystemLink = true;
			memory.type = 'system';

			if (response.memory) {
				const { total, used } = response.memory;
				memory.detail = `${this.commonService.formatBytes(used)} of ${this.commonService.formatBytes(total)}`;
				const percent = (used / total) * 100;
				if (percent > 70) {
					memory.status = 1;
				} else {
					memory.status = 0;
				}
			}
			systemStatus.push(memory);

			const disk = new Status();
			disk.status = 1;
			disk.id = 'disk';
			disk.title = 'Disk Space';
			disk.detail = 'Disk not found';
			disk.path = 'ms-settings:storagesense';
			disk.asLink = false;
			disk.isSystemLink = true;
			disk.type = 'system';

			if (response.disk) {
				const { total, used } = response.disk;
				disk.detail = `${this.commonService.formatBytes(used)} of ${this.commonService.formatBytes(total)}`;
				const percent = (used / total) * 100;
				if (percent > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
			systemStatus.push(disk);

			const warranty = new Status();
			warranty.status = 1;
			warranty.id = 'warranty';
			warranty.title = 'Warranty';
			warranty.detail = 'Warranty not found';
			warranty.path = '/support';
			warranty.asLink = false;
			/* warranty.isSystemLink = true; */
			warranty.isSystemLink = false;
			warranty.type = 'system';

			if (response.warranty) {
				const warrantyDate = this.commonService.formatDate(response.warranty.expired);
				// in warranty
				if (response.warranty.status === 0) {
					warranty.detail = `Until ${warrantyDate}`;
					warranty.status = 0;
				}
				if (response.warranty.status === 1) {
					warranty.detail = `Warranty expired on ${warrantyDate}`;
					warranty.status = 1;
				} else {
					warranty.detail = `Not available`;
					warranty.status = 1;
				}
			}
			systemStatus.push(warranty);

			const systemUpdate = new Status();
			systemUpdate.status = 1;
			systemUpdate.id = 'systemupdate';
			systemUpdate.title = 'System Update';
			systemUpdate.detail = 'Update';
			systemUpdate.path = '/system-updates';
			systemUpdate.asLink = true;
			systemUpdate.isSystemLink = false;
			systemUpdate.type = 'system';

			if (response.systemupdate) {
				const { status } = response.systemupdate;
				if (status === 1) {
					systemUpdate.status = 0;
				} else {
					systemUpdate.status = 1;
				}
			}
			systemStatus.push(systemUpdate);
		}
		return systemStatus;
	}

	private mapSecurityStatusResponse(response: any): Status[] {
		const securityStatus: Status[] = [];
		if (response) {
			const antiVirus = new Status();
			antiVirus.status = 1;
			antiVirus.id = 'anti-virus';
			antiVirus.title = 'Anti-Virus';
			antiVirus.detail = 'Disabled';
			antiVirus.path = 'anti-virus';
			antiVirus.type = 'security';

			if (response.antiVirus) {
				if (response.antiVirus.status) {
					antiVirus.status = 0;
					antiVirus.detail = 'Enabled';
				} else {
					antiVirus.status = 1;
				}
			}
			securityStatus.push(antiVirus);

			const wiFi = new Status();
			wiFi.status = 1;
			wiFi.id = 'wifi-security';
			wiFi.title = 'WiFi Security';
			wiFi.detail = 'Disabled';
			wiFi.path = 'wifi-security';
			wiFi.type = 'security';

			if (response.wifiSecurity) {
				if (response.wifiSecurity.status) {
					wiFi.status = 0;
					wiFi.detail = 'Enabled';
				} else {
					wiFi.status = 1;
				}
			}
			securityStatus.push(wiFi);

			const passwordManager = new Status();
			passwordManager.status = 1;
			passwordManager.id = 'pwdmgr';
			passwordManager.title = 'Password Manager';
			passwordManager.detail = 'Not Installed';
			passwordManager.path = 'password-protection';
			passwordManager.type = 'security';

			if (response.passwordManager) {
				if (response.passwordManager.installed) {
					passwordManager.status = 0;
					passwordManager.detail = 'Installed';
				} else {
					passwordManager.status = 1;
				}
			}
			securityStatus.push(passwordManager);

			const vpn = new Status();
			vpn.status = 1;
			vpn.id = 'vpn';
			vpn.title = 'VPN';
			vpn.detail = 'Not Installed';
			vpn.path = 'internet-protection';
			vpn.type = 'security';

			if (response.VPN) {
				if (response.VPN.installed) {
					vpn.status = 0;
					vpn.detail = 'Installed';
				} else {
					vpn.status = 1;
				}
			}
			securityStatus.push(vpn);

			const windowsHello = new Status();
			windowsHello.status = 1;
			windowsHello.id = 'windows-hello';
			windowsHello.title = 'Windows Hello';
			windowsHello.detail = 'Disabled';
			windowsHello.path = 'windows-hello';
			windowsHello.type = 'security';

			if (response.windowsHello) {
				if (response.windowsHello) {
					windowsHello.status = 0;
					windowsHello.detail = 'Enabled';
				} else {
					windowsHello.status = 1;
				}
			}
			securityStatus.push(windowsHello);
		}
		return securityStatus;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case LenovoIdKey.FirstName:
					this.firstName = notification.payload;
					break;

				default:
					break;
			}
		}
	}
}
