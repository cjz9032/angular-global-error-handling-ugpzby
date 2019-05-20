import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from 'src/app/services/timer/timer.service';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss'],
	providers: [TimerService]
})
export class WidgetDeviceComponent implements OnInit, OnDestroy {
	public myDevice: MyDevice;
	public deviceStatus: Status[];

	// subtitle = 'My device status';

	virusImage = '//vtr-ui//src//assets//Device_antivirus.png';

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private systemUpdateService: SystemUpdateService,
		private translate: TranslateService,
		private timer: TimerService,
		private metrics: MetricService
	) {
		this.myDevice = new MyDevice();
	}

	ngOnInit() {
		this.timer.start();
		this.getDeviceInfo();
	}

	ngOnDestroy() {
		const pageDuration = this.timer.stop();
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: 'Page.MyDevice',
			PageContext: 'My device status',
			PageDuration: pageDuration
		};
		this.metrics.sendMetrics(pageViewMetrics);
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
			processor.title = this.translate.instant('device.myDevice.processor.notFound'); // 'Processor not found';
			processor.detail = this.translate.instant('device.myDevice.learnMore'); // 'Learn more';
			processor.path = 'ms-settings:about';
			processor.asLink = false;
			processor.isSystemLink = true;

			if (response.processor) {
				processor.status = 0;
				processor.title = this.translate.instant('device.myDevice.processor.title'); // `Processor`;
				processor.systemDetails = `${response.processor.name}`;
			}
			systemStatus.push(processor);

			const memory = new Status();
			memory.status = 1;
			memory.id = 'memory';
			memory.title = this.translate.instant('device.myDevice.memory.notFound'); // 'Memory not found';
			memory.detail = this.translate.instant('device.myDevice.learnMore'); // 'Learn more';
			memory.path = 'ms-settings:about';
			memory.asLink = false;
			memory.isSystemLink = true;

			if (response.memory) {
				const { size, total, used } = response.memory;
				let type = response.memory.type;
				memory.title = this.translate.instant('device.myDevice.memory.title'); // `Memory `;
				if (type.toLowerCase() === 'unknown') {
					type = '';
				}
				memory.systemDetails = `${this.commonService.formatBytes(size)} ${this.translate.instant('device.myDevice.of')} ${type} ${this.translate.instant('device.myDevice.memory.ram')}`;
				// const percent = (used / total) * 100;
				const percent = parseInt(((used / total) * 100).toFixed(0), 10);
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
			disk.title = this.translate.instant('device.myDevice.diskspace.notFound'); // 'Disk not found';
			disk.detail = this.translate.instant('device.myDevice.learnMore'); // 'Learn more';
			disk.path = 'ms-settings:storagesense';
			disk.asLink = false;
			disk.isSystemLink = true;

			if (response.disk) {
				const { total, used } = response.disk;
				disk.title = this.translate.instant('device.myDevice.diskspace.title'); // `Disk Space`;
				disk.systemDetails = `${this.commonService.formatBytes(used)} ${this.translate.instant('device.myDevice.of')} ${this.commonService.formatBytes(total)}`;
				// const percent = (used / total) * 100;
				const percent = parseInt(((used / total) * 100).toFixed(0), 10);
				if (percent > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
			systemStatus.push(disk);

			const systemUpdate = new Status();
			systemUpdate.status = 1;
			systemUpdate.id = 'systemupdate';
			systemUpdate.title = this.translate.instant('device.myDevice.systemUpdate.notFound'); // 'System update not found';
			systemUpdate.detail = this.translate.instant('device.myDevice.systemUpdate.title');
			systemUpdate.path = 'device/system-updates';
			systemUpdate.asLink = true;
			systemUpdate.isSystemLink = false;

			if (response.sysupdate) {
				const updateStatus = response.sysupdate.status;
				const lastUpdate = response.sysupdate.lastupdate;
				const diffInDays = this.systemUpdateService.dateDiffInDays(lastUpdate);

				if (updateStatus === 1) {
					systemUpdate.title = this.translate.instant('device.myDevice.systemUpdate.detail.uptoDate');
					// `Software up to date `;
					systemUpdate.systemDetails = `${this.translate.instant('device.myDevice.systemUpdate.detail.updatedOn')} ${this.commonService.formatDate(lastUpdate)}`;
					if (diffInDays > 30) {
						systemUpdate.title = this.translate.instant('device.myDevice.systemUpdate.detail.outdated');
						// `Software outdated `;
						systemUpdate.status = 1;
					} else {
						systemUpdate.status = 0;
					}
				} else {
					systemUpdate.title = this.translate.instant('device.myDevice.systemUpdate.detail.outdated');
					// `Software outdated `;
					systemUpdate.systemDetails = this.translate.instant('device.myDevice.systemUpdate.detail.neverRanUpdate');
					// `never ran update`;
					systemUpdate.status = 1;
				}
			}
			systemStatus.push(systemUpdate);

			const warranty = new Status();
			warranty.status = 1;
			warranty.id = 'warranty';
			warranty.title = this.translate.instant('device.myDevice.warranty.notFound'); // 'Warranty not found';
			warranty.detail = this.translate.instant('device.myDevice.warranty.detail.title'); // 'Extend warranty';
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
					warranty.title = this.translate.instant('device.myDevice.warranty.detail.inWarranty'); // `In warranty `;
					warranty.systemDetails = `${warrantyInDays} ${this.translate.instant('device.myDevice.warranty.detail.daysRemaining')}`;
					// days remaining`;
					warranty.status = 0;
				} else if (response.warranty.status === 1) {
					warranty.title = this.translate.instant('device.myDevice.warranty.detail.outOfWarranty'); // `Out of warranty `;
					warranty.detail = `${this.translate.instant('device.myDevice.warranty.detail.expiredOn')} ${warrantyDate}`;
					// `Expired on ${warrantyDate}`;
					warranty.status = 1;
				} else {
					warranty.title = this.translate.instant('device.myDevice.warranty.detail.notAvailable');
					// `Warranty not available`;
					warranty.detail = this.translate.instant('device.myDevice.warranty.detail.support'); // 'Support';
					warranty.status = 1;
				}
			}
			systemStatus.push(warranty);
		}
		return systemStatus;
	}
}
