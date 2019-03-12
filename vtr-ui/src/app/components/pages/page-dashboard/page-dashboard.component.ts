import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss'],
	providers: [NgbModalConfig, NgbModal]
})
export class PageDashboardComponent implements OnInit {
	private firstName = 'James'; // todo: read it from local storage once lenovo id is integrated
	submit = 'Submit';
	title = `Looking energized today ${this.firstName}!`;
	feedbackButtonText = this.submit;
	public systemStatus: Status[] = [];

	forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};

	constructor(
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private commonService: CommonService
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit() {
		if (this.dashboardService.isShellAvailable) {
			console.log('PageDashboardComponent.getSystemInfo');
			this.getSystemInfo();
			// this.getSecurityStatus();
		}
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

			if (response.memory) {
				const { total, used } = response.memory;
				memory.detail = `${this.commonService.formatBytes(used)} of ${this.commonService.formatBytes(total)}`;
				const percent = (used / total) * 100;
				if (percent < 10) {
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

			if (response.disk) {
				const { total, used } = response.disk;
				disk.detail = `${this.commonService.formatBytes(used)} of ${this.commonService.formatBytes(total)}`;
				const percent = (used / total) * 100;
				if (percent > 70) {
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
			/* warranty.path = 'ms-settings:storagesense'; */
			warranty.path = '/support';
			warranty.asLink = false;
			/* warranty.isSystemLink = true; */
			warranty.isSystemLink = false;

			if (response.warranty) {
				// const status = response.warranty.status;
				const dateTill = new Date(response.warranty.expiredDate);
				warranty.detail = `Until ${this.commonService.formatDate(dateTill)}`;
				warranty.status = 0;
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

		console.log('systemStatus ' + JSON.stringify(systemStatus));
		return systemStatus;
	}
}
