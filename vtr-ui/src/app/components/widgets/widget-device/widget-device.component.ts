import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss']
})
export class WidgetDeviceComponent implements OnInit {
	public myDevice: MyDevice;
	public deviceStatus: Status[];

	subtitle = 'My device status';

	virusImage = '//vtr-ui//src//assets//Device_antivirus.png';

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService
	) {
		this.myDevice = new MyDevice();
	}

	ngOnInit() {
		this.getDeviceInfo();
	}

	private getDeviceInfo() {
		if (this.deviceService.isShellAvailable) {
			this.deviceService.getDeviceInfo()
				.then((value: any) => {
					this.myDevice = value;
					this.deviceStatus = this.mapDeviceInfo(value);
					console.log('getDeviceInfo.then', value);
				}).catch(error => {
					console.error('getDeviceInfo', error);
				});
		}
	}

	private mapDeviceInfo(response: any): Status[] {
		const systemStatus: Status[] = [];
		if (response) {

			const processor = new Status();
			processor.status = 1;
			processor.id = 'processor';
			processor.title = 'Processor not found';
			processor.detail = 'Learn more';
			processor.path = 'ms-settings:about';
			processor.asLink = false;
			processor.isSystemLink = true;

			if (response.processor) {
				processor.status = 0;
				processor.title = `Processor`;
				processor.systemDetails = `${response.processor.name}`;
			}
			systemStatus.push(processor);

			const memory = new Status();
			memory.status = 1;
			memory.id = 'memory';
			memory.title = 'Memory not found';
			memory.detail = 'Learn more';
			memory.path = 'ms-settings:about';
			memory.asLink = false;
			memory.isSystemLink = true;

			if (response.memory) {
				const { size, total, used } = response.memory;
				let type = response.memory.type;
				memory.title = `Memory `;
				if (type.toLowerCase() === 'unknown') {
					type = '';
				}
				memory.systemDetails = `${this.commonService.formatBytes(size)} of ${type} RAM`;
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
			disk.title = 'Disk not found';
			disk.detail = 'Learn more';
			disk.path = 'ms-settings:storagesense';
			disk.asLink = false;
			disk.isSystemLink = true;

			if (response.disk) {
				const { total, used } = response.disk;
				disk.title = `Disk Space`;
				disk.systemDetails = `${this.commonService.formatBytes(used)} of ${this.commonService.formatBytes(total)}`;
				const percent = (used / total) * 100;
				if (percent > 70) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
			systemStatus.push(disk);

			const systemUpdate = new Status();
			systemUpdate.status = 1;
			systemUpdate.id = 'systemupdate';
			systemUpdate.title = 'System update not found';
			systemUpdate.detail = 'System update';
			systemUpdate.path = '/system-updates';
			systemUpdate.asLink = true;
			systemUpdate.isSystemLink = false;

			if (response.sysupdate) {
				const updateStatus = response.sysupdate.status;
				const lastUpdate = response.sysupdate.lastupdate;
				if (updateStatus === 1) {
					systemUpdate.title = `Software up to date `;
					systemUpdate.systemDetails = `updated on ${this.commonService.formatDate(lastUpdate)}`;
					systemUpdate.status = 0;
				} else {
					systemUpdate.title = `Software outdated `;
					systemUpdate.systemDetails = `never ran update`;
					systemUpdate.status = 1;
				}
			}
			systemStatus.push(systemUpdate);

			const warranty = new Status();
			warranty.status = 1;
			warranty.id = 'warranty';
			warranty.title = 'Warranty not found';
			warranty.detail = 'Extend warranty';
			warranty.path = '/support';
			warranty.asLink = true;
			warranty.isSystemLink = false;

			if (response.warranty) {
				const warrantyDate = this.commonService.formatDate(response.warranty.expired);
				// in warranty
				if (response.warranty.status === 0) {
					const today = new Date();
					const expired = new Date(response.warranty.expired);
					const warrantyInDays = this.commonService.getDaysBetweenDates(today, expired);
					warranty.title = `In warranty `;
					warranty.systemDetails = `${warrantyInDays} days remaining`;
					warranty.status = 0;
				} else if (response.warranty.status === 1) {
					warranty.title = `Out of warranty `;
					warranty.detail = `Expired on ${warrantyDate}`;
					warranty.status = 1;
				} else {
					warranty.title = `Warranty not available`;
					warranty.detail = 'Support';
					warranty.status = 1;
				}
			}
			systemStatus.push(warranty);
		}
		return systemStatus;
	}
}
