import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from 'src/app/services/timer/timer.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import {DashboardService} from 'src/app/services/dashboard/dashboard.service';
@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss'],
	providers: [TimerService]
})
export class WidgetDeviceComponent implements OnInit, OnDestroy {
	public myDevice: MyDevice;
	public deviceStatus: Status[] = [];

	// subtitle = 'My device status';

	virusImage = '//vtr-ui//src//assets//Device_antivirus.png';

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private systemUpdateService: SystemUpdateService,
		private translate: TranslateService,
		private timer: TimerService,
		private metrics: MetricService,
		private dashboardServcie: DashboardService
	) {
		this.myDevice = new MyDevice();
		this.setDefaultInfo();
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

	private setDefaultInfo() {
		const systemStatus = this.deviceStatus;
		const processor = new Status();
		processor.id = 'processor';
		processor.title = this.translate.instant('device.myDevice.processor.notFound'); // 'Processor not found';
		processor.detail = this.translate.instant('device.myDevice.learnMore'); // 'Learn more';
		processor.path = 'ms-settings:about';
		processor.asLink = false;
		processor.isSystemLink = true;
		systemStatus[0] = processor;

		const memory = new Status();
		memory.id = 'memory';
		memory.title = this.translate.instant('device.myDevice.memory.notFound'); // 'Memory not found';
		memory.detail = this.translate.instant('device.myDevice.learnMore'); // 'Learn more';
		memory.path = 'ms-settings:about';
		memory.asLink = false;
		memory.isSystemLink = true;
		systemStatus[1] = memory;

		const disk = new Status();
		disk.id = 'disk';
		disk.title = this.translate.instant('device.myDevice.diskspace.notFound'); // 'Disk not found';
		disk.detail = this.translate.instant('device.myDevice.learnMore'); // 'Learn more';
		disk.path = 'ms-settings:storagesense';
		disk.asLink = false;
		disk.isSystemLink = true;
		systemStatus[2] = disk;

		const systemUpdate = new Status();
		systemUpdate.id = 'systemupdate';
		systemUpdate.title = this.translate.instant('device.myDevice.systemUpdate.notFound'); // 'System update not found';
		systemUpdate.detail = this.translate.instant('device.myDevice.systemUpdate.title');
		systemUpdate.path = 'device/system-updates';
		systemUpdate.asLink = true;
		systemUpdate.isSystemLink = false;
		systemStatus[3] = systemUpdate;

		const warranty = new Status();
		warranty.id = 'warranty';
		warranty.title = this.translate.instant('device.myDevice.warranty.notFound'); // 'Warranty not found';
		warranty.detail = this.translate.instant('device.myDevice.warranty.detail.title'); // 'Extend warranty';
		warranty.path = '/support';
		warranty.asLink = true;
		warranty.isSystemLink = false;
		systemStatus[4] = warranty;
	}

	private getDeviceInfo() {
		// machineinfo
		this.deviceService.getMachineInfo().then((data) => {
			this.myDevice.family = data.family;
			this.myDevice.sn = data.serialnumber;
			this.myDevice.bios = data.biosVersion;
			this.myDevice.subBrand = data.subBrand;
			this.myDevice.productNo = data.mtm;
		});

		// processor memory disk
		this.deviceService.getHardwareInfo().then(data => {
			if (data) {
				const processor = this.deviceStatus[0];
				processor.status = 0;
				processor.title = this.translate.instant('device.myDevice.processor.title'); // `Processor`;
				processor.systemDetails = `${data.processor.name}`;

				const memory = this.deviceStatus[1];
				const { size, total, used } = data.memory;
				let type = data.memory.type;
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

				const disk = this.deviceStatus[2];
				const  totalDisk = data.disk.total;
				const usedDisk = data.disk.used;
				disk.title = this.translate.instant('device.myDevice.diskspace.title'); // `Disk Space`;
				disk.systemDetails = `${this.commonService.formatBytes(usedDisk)} ${this.translate.instant('device.myDevice.of')} ${this.commonService.formatBytes(totalDisk)}`;
				// const percent = (used / total) * 100;
				const percentDisk = parseInt(((usedDisk / totalDisk) * 100).toFixed(0), 10);
				if (percentDisk > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}

			}
		});

		// sysupdate
		this.dashboardServcie.getRecentUpdateInfo().then(data => {
			if (data) {
				const systemUpdate = this.deviceStatus[3];

				const updateStatus = data.status;
				const lastUpdate = data.lastupdate;
				const diffInDays = this.systemUpdateService.dateDiffInDays(lastUpdate);

				if (updateStatus === 1) {
					systemUpdate.title = this.translate.instant('device.myDevice.systemUpdate.detail.uptoDate');
					// `Software up to date `;
					systemUpdate.systemDetails = `${this.translate.instant('device.myDevice.systemUpdate.detail.updatedOn')} ${this.commonService.formatLocalDate(lastUpdate)}`;
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
		});

		// warranty
		this.dashboardServcie.getWarrantyInfo().then(data => {
			if (data) {
				const warranty = this.deviceStatus[4];
				const warrantyDate = this.commonService.formatDate(data.expired);
				// in warranty
				if (data.status === 0) {
					const today = new Date();
					const expired = new Date(data.expired);
					const warrantyInDays = this.commonService.getDaysBetweenDates(today, expired);
					warranty.title = this.translate.instant('device.myDevice.warranty.detail.inWarranty'); // `In warranty `;
					warranty.systemDetails = `${warrantyInDays} ${this.translate.instant('device.myDevice.warranty.detail.daysRemaining')}`;
					// days remaining`;
					warranty.status = 0;
				} else if (data.status === 1) {
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
		});
	}
}
