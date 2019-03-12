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
			processor.description = 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del';
			processor.detail = 'Learn more';
			processor.path = 'ms-settings:about';
			processor.asLink = false;
			processor.isSystemLink = true;

			if (response.processor) {
				processor.status = 0;
				processor.title = `Processor (${response.processor.name})`;
			}
			systemStatus.push(processor);

			const memory = new Status();
			memory.status = 1;
			memory.id = 'memory';
			memory.title = 'Memory not found';
			memory.description = 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del';
			memory.detail = 'Free memory';
			memory.path = 'ms-settings:about';
			memory.asLink = false;
			memory.isSystemLink = true;

			if (response.memory) {
				const { size, type } = response.memory;
				memory.title = `Memory (${this.commonService.formatBytes(size)} of ${type} RAM)`;
				memory.status = 0;
				// const percent = (used / total) * 100;
				// if (percent < 10) {
				// 	memory.status = 1;
				// } else {
				// 	memory.status = 0;
				// }
			}
			systemStatus.push(memory);

			// const disk = new Status();
			// disk.status = 1;
			// disk.id = 'disk';
			// disk.title = 'Disk not found';
			// disk.description = 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del';
			// disk.detail = 'Learn more';
			// disk.path = 'ms-settings:storagesense';
			// disk.asLink = false;
			// disk.isSystemLink = true;

			// if (response.disk) {
			// 	const { size, type } = response.disk;
			// 	disk.title = `Memory (${this.commonService.formatBytes(size)} of ${type} RAM)`;
			// 	disk.status = 0;
			// }
			// systemStatus.push(disk);


			const sysupdate = new Status();
			sysupdate.status = 1;
			sysupdate.id = 'systemupdate';
			sysupdate.title = 'System update not found';
			sysupdate.description = 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del';
			sysupdate.detail = 'System update';
			sysupdate.path = '/system-updates';
			sysupdate.asLink = true;
			sysupdate.isSystemLink = false;

			if (response.sysupdate) {
				const updateStatus = response.sysupdate.status;
				const lastUpdate = response.sysupdate.lastupdate;
				if (updateStatus === 1) {
					sysupdate.title = `Software up to date (updated ${this.commonService.formatDate(lastUpdate)})`;
					sysupdate.status = 0;
				} else {
					sysupdate.title = `Software up to date (updated ${this.commonService.formatDate(lastUpdate)})`;
					sysupdate.status = 1;
				}
			}
			systemStatus.push(sysupdate);

			const warranty = new Status();
			warranty.status = 1;
			warranty.id = 'warranty';
			warranty.title = 'Warranty not found';
			warranty.description = 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del';
			warranty.detail = 'Extend warranty';
			warranty.path = '/support';
			warranty.asLink = true;
			warranty.isSystemLink = false;

			if (response.warranty) {
				const today = new Date();
				const expired = new Date(response.warranty.expired);
				if (today.getTime() > expired.getTime()) {
					warranty.title = `Out of warranty (Expired on ${this.commonService.formatDate(expired.toString())})`;
					warranty.status = 1;
				} else {
					warranty.status = 0;
					warranty.title = `In warranty (${this.commonService.getDaysBetweenDates(today, expired)} days remaining)`;
				}
			}
			systemStatus.push(warranty);
		}
		return systemStatus;
	}
}
